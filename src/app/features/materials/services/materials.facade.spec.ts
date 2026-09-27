import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppMessageService } from '@core/services/app-message-service';
import { IdentityService } from '@core/services/identity-service';
import { Material } from '../models/Material';
import { MaterialsFacade } from './materials.facade';

describe('Materials management HTTP flow', () => {
  let facade: MaterialsFacade;
  let http: HttpTestingController;
  const admin = signal(true);
  const material: Material = {
    id: 7,
    name: 'مادة طبية',
    price: 125.5,
    description: 'وصف',
    isActive: true,
  };
  const result = (data: unknown) => ({ isSuccess: true, statusCode: 200, message: '', data });
  const list = (items: Material[] = [material], totalPages = 1) =>
    result({ items, pageNumber: 1, pageSize: 10, totalCount: items.length, totalPages });
  const listRequest = () => http.expectOne((request) => request.url.includes('/get-all-materials'));
  const settle = async () => {
    await Promise.resolve();
    await Promise.resolve();
  };

  beforeEach(() => {
    admin.set(true);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MaterialsFacade,
        { provide: IdentityService, useValue: { isAdmin: admin } },
        {
          provide: AppMessageService,
          useValue: {
            addSuccessMessage: vi.fn(),
            addErrorMessage: vi.fn(),
            buildHttpErrorDetail: (_error: unknown, fallback: string) => fallback,
          },
        },
      ],
    });
    facade = TestBed.inject(MaterialsFacade);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('sends false explicitly, resets the page and preserves page size when filtering', async () => {
    facade.pageNumber.set(3);
    facade.pageSize.set(25);
    facade.setStatusFilter(false);
    const request = listRequest();
    expect(request.request.url).toContain('PageNumber=1&PageSize=25&isActive=false');
    request.flush(list());
    await settle();
    facade.setStatusFilter(null);
    const all = listRequest();
    expect(all.request.url).not.toContain('isActive=');
    all.flush(list());
    await settle();
  });

  it('does not allow a non-admin to load or mutate materials', async () => {
    admin.set(false);
    facade.initialize();
    facade.openCreate();
    facade.openEdit(material);
    facade.requestDelete(material);
    await facade.toggleMaterialStatus(material);
    await facade.saveMaterial(material);
    await facade.deleteMaterial();
    http.expectNone(() => true);
    expect(facade.editor()).toBeNull();
    expect(facade.materialToDelete()).toBeNull();
  });

  it('ignores an old list response after the filter changes', async () => {
    facade.initialize();
    const old = listRequest();
    facade.setStatusFilter(false);
    const current = listRequest();
    current.flush(list([{ ...material, isActive: false }]));
    await settle();
    old.flush(list());
    await settle();
    expect(facade.materials()[0].isActive).toBe(false);
    expect(facade.loading()).toBe(false);
  });

  it('loads authoritative edit details, updates them, and refreshes the list', async () => {
    facade.openEdit(material);
    http
      .expectOne((request) => request.url.endsWith('/get-material-by-id/7'))
      .flush(result({ ...material, price: 200 }));
    await settle();
    expect(facade.editor()).toEqual({ mode: 'edit', id: 7, material: { ...material, price: 200 } });
    const pending = facade.saveMaterial({
      name: ' اسم محدث ',
      price: 210.25,
      description: ' وصف ',
      isActive: false,
    });
    const request = http.expectOne((request) => request.method === 'PUT');
    expect(request.request.body).toEqual({
      id: 7,
      name: 'اسم محدث',
      price: 210.25,
      description: 'وصف',
      isActive: false,
    });
    request.flush(result(true));
    await settle();
    listRequest().flush(list());
    await pending;
    expect(facade.editor()).toBeNull();
    expect(facade.actionLoading()).toBe(false);
  });

  it('validates prices and prevents duplicate submissions while creating', async () => {
    facade.openCreate();
    for (const price of [-1, 2.555, NaN, Infinity]) {
      await facade.saveMaterial({ ...material, price });
      http.expectNone((request) => request.method === 'POST');
      expect(facade.formError()).not.toBe('');
    }
    const value = { name: ' مادة ', price: 0, description: '', isActive: true };
    const pending = facade.saveMaterial(value);
    await facade.saveMaterial(value);
    facade.closeEditor();
    expect(facade.editor()).not.toBeNull();
    const request = http.expectOne((request) => request.method === 'POST');
    expect(request.request.body).toEqual({ ...value, name: 'مادة' });
    request.flush(result(material));
    await settle();
    listRequest().flush(list());
    await pending;
    expect(facade.editor()).toBeNull();
  });

  it('does not reopen an editor when its details arrive after cancellation', async () => {
    facade.openEdit(material);
    const details = http.expectOne((request) => request.url.endsWith('/get-material-by-id/7'));
    facade.closeEditor();
    details.flush(result(material));
    await settle();
    expect(facade.editor()).toBeNull();
  });

  it('requires delete confirmation and preserves the confirmation on server failure', async () => {
    facade.requestDelete(material);
    http.expectNone((request) => request.method === 'DELETE');
    const pending = facade.deleteMaterial();
    http
      .expectOne((request) => request.method === 'DELETE')
      .flush({ isSuccess: false, message: 'المادة مرتبطة بعمليات', data: false });
    await pending;
    expect(facade.materialToDelete()).toEqual(material);
    expect(facade.deleteError()).toBe('المادة مرتبطة بعمليات');
    expect(facade.actionLoading()).toBe(false);
  });

  it('returns to the preceding page when deletion removes the last row', async () => {
    facade.pageNumber.set(2);
    facade.requestDelete(material);
    const pending = facade.deleteMaterial();
    http.expectOne((request) => request.method === 'DELETE').flush(result(true));
    await settle();
    listRequest().flush(list([], 1));
    await settle();
    const request = listRequest();
    expect(request.request.url).toContain('PageNumber=1');
    request.flush(list());
    await pending;
    expect(facade.pageNumber()).toBe(1);
    expect(facade.materialToDelete()).toBeNull();
  });

  it('reloads a filtered list after toggling status', async () => {
    facade.isActiveFilter.set(true);
    const pending = facade.toggleMaterialStatus(material);
    const request = http.expectOne((request) => request.url.endsWith('/toggle-status/7'));
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toBeNull();
    request.flush(result(true));
    await settle();
    const refresh = listRequest();
    expect(refresh.request.url).toContain('isActive=true');
    refresh.flush(list([], 0));
    await pending;
    expect(facade.materials()).toEqual([]);
    expect(facade.togglingId()).toBeNull();
  });
});
