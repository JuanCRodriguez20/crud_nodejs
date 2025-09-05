import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Transaction, 
  CreateTransactionRequest, 
  UpdateTransactionRequest,
  TransactionFilters,
  TransactionListResponse,
  TransactionSummary,
  CategoryStats
} from '../models/transaction.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getTransactions(filters: TransactionFilters = {}): Observable<ApiResponse<TransactionListResponse>> {
    let params = new HttpParams();
    
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate.toISOString());
    }
    if (filters.type) {
      params = params.set('type', filters.type);
    }
    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }
    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<ApiResponse<TransactionListResponse>>(this.apiUrl, { params });
  }

  getTransactionById(id: string): Observable<ApiResponse<{ transaction: Transaction }>> {
    return this.http.get<ApiResponse<{ transaction: Transaction }>>(`${this.apiUrl}/${id}`);
  }

  createTransaction(transactionData: CreateTransactionRequest): Observable<ApiResponse<{ transaction: Transaction }>> {
    return this.http.post<ApiResponse<{ transaction: Transaction }>>(this.apiUrl, transactionData);
  }

  updateTransaction(id: string, updateData: UpdateTransactionRequest): Observable<ApiResponse<{ transaction: Transaction }>> {
    return this.http.put<ApiResponse<{ transaction: Transaction }>>(`${this.apiUrl}/${id}`, updateData);
  }

  deleteTransaction(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  getTransactionsSummary(filters: TransactionFilters = {}): Observable<ApiResponse<{ summary: TransactionSummary }>> {
    let params = new HttpParams();
    
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate.toISOString());
    }
    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }

    return this.http.get<ApiResponse<{ summary: TransactionSummary }>>(`${this.apiUrl}/summary`, { params });
  }

  getCategoryStats(filters: TransactionFilters = {}): Observable<ApiResponse<{ stats: CategoryStats[] }>> {
    let params = new HttpParams();
    
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate.toISOString());
    }
    if (filters.type) {
      params = params.set('type', filters.type);
    }

    return this.http.get<ApiResponse<{ stats: CategoryStats[] }>>(`${this.apiUrl}/stats/categories`, { params });
  }

  exportTransactions(filters: TransactionFilters = {}): Observable<Blob> {
    let params = new HttpParams();
    
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate.toISOString());
    }
    if (filters.type) {
      params = params.set('type', filters.type);
    }
    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }

    return this.http.get(`${environment.apiUrl}/export/transactions`, {
      params,
      responseType: 'blob'
    });
  }

  exportSummary(filters: TransactionFilters = {}): Observable<Blob> {
    let params = new HttpParams();
    
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate.toISOString());
    }
    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId);
    }

    return this.http.get(`${environment.apiUrl}/export/summary`, {
      params,
      responseType: 'blob'
    });
  }
}