import { Category } from './category.model';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  categoryId: number;
  category: Category;
}

export interface CreateTransactionRequest {
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: number;
  date?: Date;
}

export interface UpdateTransactionRequest {
  description?: string;
  amount?: number;
  type?: TransactionType;
  categoryId?: number;
  date?: Date;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: TransactionType;
  categoryId?: number;
  page?: number;
  limit?: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface CategoryStats {
  id: number;
  name: string;
  color: string;
  total: number;
  count: number;
  type?: TransactionType; // This might be derived from context
}