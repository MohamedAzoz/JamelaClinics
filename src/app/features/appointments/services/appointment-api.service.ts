import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from 'environments/environment';
import { CreateAppointments } from '../models/CreateAppointments';
import { Appointments } from '../models/Appointments';
import { Result } from '@core/models/Result';
import { PaginatedResult } from '@core/models/PaginatedResult';
import { FilterAppointment, FilterAppointmentsForExcel } from '../models/FilterAppointment';
import { AppointmentUpdate } from '../models/AppointmentUpdate';

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

  //   PATCH
  // /api/Appointments/{id}/cancel
  cancelAppointment(id: number) {
    return this._http.patch<Result<boolean>>(`${this._baseUrl}/${id}/cancel`, null);
  }

  // PATCH
  // /api/Appointments/{id}/pay
  payAppointment(id: number) {
    return this._http.patch<Result<boolean>>(`${this._baseUrl}/${id}/pay`, null);
  }

  // PATCH
  // /api/Appointments/{id}/complete
  completeAppointment(id: number) {
    return this._http.patch<Result<boolean>>(`${this._baseUrl}/${id}/complete`, null);
  }

  // GET
  // /api/Appointments/schedule/{scheduleId}
  getAppointmentsByScheduleId(scheduleId: number) {
    return this._http.get<Result<Appointments[]>>(`${this._baseUrl}/schedule/${scheduleId}`);
  }

  // PUT
  // /api/Appointments/update
  updateAppointment(appointment: AppointmentUpdate) {
    return this._http.put<Result<boolean>>(`${this._baseUrl}/update`, appointment);
  }

  // GET
  // /api/Appointments/my-report
  getMyReport(filter: FilterAppointment) {
    let url = `${this._baseUrl}/my-report`;
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
  // /api/Appointments/doctor/{doctorId}/report
  getDoctorReport(doctorId: string, filter: FilterAppointment) {
    let url = `${this._baseUrl}/doctor/${doctorId}/report`;
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
}
