import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Service } from '@angular/core';
import { Result } from '@core/models/Result';
import { environment } from 'environments/environment';
import { CreateExpense } from '../models/CreateExpense';
import { ReportExpense } from '../models/ReportExpense';
import { Expense } from '../models/Expense';
import { TreasurySummary } from '../models/TreasurySummary';
import { PaginatedResult } from '@core/models/PaginatedResult';

@Service()
export class TreasuryApiService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _environment = environment;
  private readonly _baseUrl = `${this._environment.appBaseUrl}/Treasury`;

  //     POST
  // /api/Treasury/expense
  postExpense(expense: CreateExpense) {
    return this._httpClient.post<Result<boolean>>(`${this._baseUrl}/expense`, expense);
  }

  // GET
  // /api/Treasury/report
  getReport(report: ReportExpense) {
    let params = new HttpParams();
    if (report.type) params = params.set('Type', report.type.toString());
    if (report.period) params = params.set('Period', report.period);
    if (report.fromDate) params = params.set('FromDate', report.fromDate.toString());
    if (report.toDate) params = params.set('ToDate', report.toDate.toString());
    if (report.pageNumber) params = params.set('PageNumber', report.pageNumber.toString());
    if (report.pageSize) params = params.set('PageSize', report.pageSize.toString());
    return this._httpClient.get<Result<PaginatedResult<Expense[]>>>(`${this._baseUrl}/report`, {
      params,
    });
  }

  // GET
  // /api/Treasury/summary
  getSummary(summary: ReportExpense) {
    let params = new HttpParams();
    if (summary.type) params = params.set('Type', summary.type.toString());
    if (summary.period) params = params.set('Period', summary.period);
    if (summary.fromDate) params = params.set('FromDate', summary.fromDate.toString());
    if (summary.toDate) params = params.set('ToDate', summary.toDate.toString());
    if (summary.pageNumber) params = params.set('PageNumber', summary.pageNumber.toString());
    if (summary.pageSize) params = params.set('PageSize', summary.pageSize.toString());
    return this._httpClient.get<Result<TreasurySummary>>(`${this._baseUrl}/summary`, {
      params,
    });
  }

  // PUT
  // /api/Treasury/expense/{id}
  putExpense(id: number, expense: CreateExpense) {
    return this._httpClient.put<Result<boolean>>(`${this._baseUrl}/expense/${id}`, expense);
  }

  // DELETE
  // /api/Treasury/expense/{id}
  deleteExpense(id: number) {
    return this._httpClient.delete<Result<boolean>>(`${this._baseUrl}/expense/${id}`);
  }
}
