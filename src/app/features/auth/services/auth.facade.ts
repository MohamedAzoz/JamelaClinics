import { inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { IdentityService } from '../../../core/services/identity-service';
import { AppMessageService } from '../../../core/services/app-message-service';
import { RoutesManagement } from '../../../shared/constants/app-routes.constants';
import { LoginRequest } from '../models/LoginRequest';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';

@Service()
export class AuthFacade {
  private readonly _api = inject(AuthApiService);
  private readonly _identity = inject(IdentityService);
  private readonly _router = inject(Router);
  private readonly _messages = inject(AppMessageService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async login(request: LoginRequest): Promise<void> {
    if (this.loading()) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await firstValueFrom(this._api.login(request));

      if (result.isSuccess && result.data?.token) {
        await this._identity.setAuth(result.data.token);
        this._messages.addSuccessMessage(`مرحبا ${result.data.fullName}`);
        void this._router.navigate([`/${RoutesManagement.MAIN.path}`]);
      } else {
        const msg = result.message ?? 'فشل تسجيل الدخول. يرجى المحاولة مجدداً.';
        this._messages.addErrorMessage(msg);
      }
    } catch {
      const msg = 'حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.';
      this._messages.addErrorMessage(msg);
    } finally {
      this.loading.set(false);
    }
  }
  logout() {
    this._identity.clearAuth();
    this._messages.addSuccessMessage('تم تسجيل الخروج بنجاح');
    void this._router.navigate([`/${RoutesManagement.AUTH.path}`]);
  }

  readonly changePasswordLoading = signal(false);

  async changePassword(request: ChangePasswordRequest): Promise<boolean> {
    if (this.changePasswordLoading()) return false;

    this.changePasswordLoading.set(true);

    try {
      const result = await firstValueFrom(this._api.changePassword(request));

      if (result?.isSuccess !== false) {
        this._messages.addSuccessMessage('تم تغيير كلمة المرور بنجاح');
        // If the API returns a new token, update stored auth
        if (result?.token) {
          await this._identity.setAuth(result.token);
        }
        return true;
      } else {
        const msg = result?.message ?? 'فشل تغيير كلمة المرور. يرجى التأكد من البيانات المدخلة.';
        this._messages.addErrorMessage(msg);
        return false;
      }
    } catch {
      this._messages.addErrorMessage('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.');
      return false;
    } finally {
      this.changePasswordLoading.set(false);
    }
  }
}
