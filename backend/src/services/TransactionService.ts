import { AppDataSource } from '../config/database';
import { Transaction } from '../entities/Transaction';
import { CreateTransactionRequest, UpdateTransactionRequest, TransactionFilters } from '../types';
import { createError } from '../middlewares/errorHandler';
import { validateEntity } from '../middlewares/validation';
import { CategoryService } from './CategoryService';

export class TransactionService {
  private transactionRepository = AppDataSource.getRepository(Transaction);
  private categoryService = new CategoryService();

  async createTransaction(transactionData: CreateTransactionRequest, userId: string): Promise<Transaction> {
    await this.categoryService.getCategoryById(transactionData.categoryId, userId);

    const transaction = this.transactionRepository.create({
      description: transactionData.description,
      amount: transactionData.amount,
      type: transactionData.type,
      userId: parseInt(userId),
      categoryId: parseInt(transactionData.categoryId),
      date: transactionData.date || new Date()
    });

    const validationErrors = await validateEntity(transaction);
    if (validationErrors.length > 0) {
      throw createError(validationErrors.join(', '), 400);
    }

    return await this.transactionRepository.save(transaction);
  }

  async getUserTransactions(
    userId: string, 
    filters: TransactionFilters = {}
  ): Promise<{ transactions: Transaction[]; total: number; page: number; limit: number }> {
    const { startDate, endDate, type, categoryId, page = 1, limit = 20 } = filters;
    
    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.userId = :userId', { userId })
      .orderBy('transaction.date', 'DESC')
      .addOrderBy('transaction.createdAt', 'DESC');

    if (startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', { endDate });
    }

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    if (categoryId) {
      queryBuilder.andWhere('transaction.categoryId = :categoryId', { categoryId: parseInt(categoryId) });
    }

    const total = await queryBuilder.getCount();
    const transactions = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { transactions, total, page, limit };
  }

  async getTransactionById(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: parseInt(id), userId: parseInt(userId) },
      relations: ['category']
    });

    if (!transaction) {
      throw createError('Transaction not found', 404);
    }

    return transaction;
  }

  async updateTransaction(
    id: string, 
    updateData: UpdateTransactionRequest, 
    userId: string
  ): Promise<Transaction> {
    const transaction = await this.getTransactionById(id, userId);

    if (updateData.categoryId && parseInt(updateData.categoryId) !== transaction.categoryId) {
      await this.categoryService.getCategoryById(updateData.categoryId, userId);
    }

    Object.assign(transaction, {
      ...updateData,
      categoryId: updateData.categoryId ? parseInt(updateData.categoryId) : transaction.categoryId
    });

    const validationErrors = await validateEntity(transaction);
    if (validationErrors.length > 0) {
      throw createError(validationErrors.join(', '), 400);
    }

    return await this.transactionRepository.save(transaction);
  }

  async deleteTransaction(id: string, userId: string): Promise<void> {
    const transaction = await this.getTransactionById(id, userId);
    await this.transactionRepository.remove(transaction);
  }

  async getTransactionsSummary(userId: string, filters: TransactionFilters = {}): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
  }> {
    const { startDate, endDate, categoryId } = filters;
    
    let query = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
        COUNT(*) as transaction_count
      FROM transactions 
      WHERE user_id = ?
    `;

    const params: any[] = [parseInt(userId)]; // Convert to number for SQLite
    let paramIndex = 2;

    if (startDate) {
      query += ` AND date >= ?`;
      // Convert ISO date to SQLite format: YYYY-MM-DD HH:MM:SS.SSS
      const sqliteStartDate = startDate.toISOString().replace('T', ' ').replace('Z', '');
      params.push(sqliteStartDate);
    }

    if (endDate) {
      query += ` AND date <= ?`;
      // Convert ISO date to SQLite format: YYYY-MM-DD HH:MM:SS.SSS
      const sqliteEndDate = endDate.toISOString().replace('T', ' ').replace('Z', '');
      params.push(sqliteEndDate);
    }

    if (categoryId) {
      query += ` AND category_id = ?`;
      params.push(parseInt(categoryId));
    }

    const result = await AppDataSource.query(query, params);
    const row = result[0];

    const totalIncome = parseFloat(row.total_income) || 0;
    const totalExpense = parseFloat(row.total_expense) || 0;

    const summary = {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: parseInt(row.transaction_count) || 0
    };

    return summary;
  }

  async getCategoryStats(userId: string, filters: TransactionFilters = {}): Promise<any[]> {
    const { startDate, endDate, type } = filters;
    
    let query = `
      SELECT 
        c.id,
        c.name,
        c.color,
        SUM(t.amount) as total,
        COUNT(t.id) as count
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id
      WHERE c.user_id = ?
    `;

    const params: any[] = [parseInt(userId)];

    if (startDate) {
      query += ` AND (t.date >= ? OR t.date IS NULL)`;
      // Convert ISO date to SQLite format: YYYY-MM-DD HH:MM:SS.SSS
      const sqliteStartDate = startDate.toISOString().replace('T', ' ').replace('Z', '');
      params.push(sqliteStartDate);
    }

    if (endDate) {
      query += ` AND (t.date <= ? OR t.date IS NULL)`;
      // Convert ISO date to SQLite format: YYYY-MM-DD HH:MM:SS.SSS
      const sqliteEndDate = endDate.toISOString().replace('T', ' ').replace('Z', '');
      params.push(sqliteEndDate);
    }

    if (type) {
      query += ` AND (t.type = ? OR t.type IS NULL)`;
      params.push(type);
    }

    query += ` GROUP BY c.id, c.name, c.color ORDER BY total DESC`;

    const result = await AppDataSource.query(query, params);

    return result;
  }
}