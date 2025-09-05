import { Request } from 'express';
import { User } from '../entities/User';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateTransactionRequest {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  date?: Date;
}

export interface UpdateTransactionRequest {
  description?: string;
  amount?: number;
  type?: 'income' | 'expense';
  categoryId?: string;
  date?: Date;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: 'income' | 'expense';
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  color?: string;
}

export interface UserSettingsRequest {
  balanceValidationEnabled?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}