import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../models/category.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ApiResponse<{ categories: Category[] }>> {
    return this.http.get<ApiResponse<{ categories: Category[] }>>(this.apiUrl);
  }

  getCategoryById(id: string): Observable<ApiResponse<{ category: Category }>> {
    return this.http.get<ApiResponse<{ category: Category }>>(`${this.apiUrl}/${id}`);
  }

  createCategory(categoryData: CreateCategoryRequest): Observable<ApiResponse<{ category: Category }>> {
    return this.http.post<ApiResponse<{ category: Category }>>(this.apiUrl, categoryData);
  }

  updateCategory(id: string, updateData: UpdateCategoryRequest): Observable<ApiResponse<{ category: Category }>> {
    return this.http.put<ApiResponse<{ category: Category }>>(`${this.apiUrl}/${id}`, updateData);
  }

  deleteCategory(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }
}