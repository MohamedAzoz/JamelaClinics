import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from 'environments/environment';
import { CreateAppointments } from '../models/CreateAppointments';
import { Appointments } from '../models/Appointments';
import { Result } from '@core/models/Result';
import { PaginatedResult } from '@core/models/PaginatedResult';
import { FilterAppointment, FilterAppointmentsForExcel } from '../models/FilterAppointment';

@Service()
export class AppointmentApiService {
  private _http = inject(HttpClient);
  private _baseUrl = `${environment.appBaseUrl}/Appointments`;

  //     POST
  // /api/Appointments/create-appointment
  createAppointments(data: CreateAppointments) {
    return this._http.post<Result<boolean>>(`${this._baseUrl}/create-appointment`, data);
  }

  // GET
  // /api/Appointments/get-all-appointments
  getAllAppointments(filter: FilterAppointment) {
    let url = `${this._baseUrl}/get-all-appointments`;
    const params: string[] = [];
    if (filter.Period !== undefined) {
      params.push(`Period=${filter.Period}`);
    }
    if (filter.FromDate !== undefined) {
      params.push(`FromDate=${filter.FromDate}`);
    }
    if (filter.ToDate !== undefined) {
      params.push(`ToDate=${filter.ToDate}`);
    }
    if (filter.PageNumber !== undefined) {
      params.push(`PageNumber=${filter.PageNumber}`);
    }
    if (filter.PageSize !== undefined) {
      params.push(`PageSize=${filter.PageSize}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this._http.get<Result<PaginatedResult<Appointments[]>>>(url);
  }

  // GET
  // /api/Appointments/export-excel
  getExportAppointments(filter: FilterAppointmentsForExcel) {
    let url = `${this._baseUrl}/export-excel`;
    const params: string[] = [];
    if (filter.Period !== undefined) {
      params.push(`Period=${filter.Period}`);
    }
    if (filter.FromDate !== undefined) {
      params.push(`FromDate=${filter.FromDate}`);
    }
    if (filter.ToDate !== undefined) {
      params.push(`ToDate=${filter.ToDate}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this._http.get(url, { responseType: 'blob' });
  }
}
