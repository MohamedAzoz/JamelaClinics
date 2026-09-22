import { Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { inject } from '@angular/core';
import { RegisterEmployeeRequest } from '../models/RegisterEmployee';
import { RegisterEmployeeResponse } from '../models/RegisterEmployeeResponse';
import { Result } from '../../../core/models/Result';
import { LoginRequest } from '../models/LoginRequest';
import { LoginResponse } from '../models/LoginResponse';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { ChangePasswordResponse } from '../models/ChangePasswordResponse';
import { AdminChangePasswordRequest } from '../models/AdminChangePasswordRequest';

@Service()
export class AuthApiService {
  private _httpClient = inject(HttpClient);

  private _baseUrl = `${environment.appBaseUrl}/Auth`;

  registerEmployee(request: RegisterEmployeeRequest) {
    const url = `${this._baseUrl}/register-employee`;
    return this._httpClient.post<Result<RegisterEmployeeResponse>>(url, request);
  }
  //   /api/Auth/login
  login(request: LoginRequest) {
    const url = `${this._baseUrl}/login`;
    return this._httpClient.post<Result<LoginResponse>>(url, request);
  }

  getCurrentUser() {
    const url = `${this._baseUrl}/GetCurrentUser`;
    return this._httpClient.get<Result<LoginResponse>>(url);
  }

  changePassword(request: ChangePasswordRequest) {
    const url = `${this._baseUrl}/change-password`;
    return this._httpClient.post<ChangePasswordResponse>(url, request);
  }

  adminChangePassword(request: AdminChangePasswordRequest) {
    const url = `${this._baseUrl}/admin-change-password`;
    return this._httpClient.post<Result<boolean>>(url, request);
  }
}
