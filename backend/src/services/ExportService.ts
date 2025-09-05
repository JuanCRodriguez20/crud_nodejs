import * as csvWriter from 'csv-writer';
import { TransactionService } from './TransactionService';
import { TransactionFilters } from '../types';
import { createError } from '../middlewares/errorHandler';
import path from 'path';
import fs from 'fs';

export class ExportService {
  private transactionService = new TransactionService();

  async exportTransactionsToCSV(
    userId: string, 
    filters: TransactionFilters = {}
  ): Promise<string> {
    try {
      const { transactions } = await this.transactionService.getUserTransactions(
        userId, 
        { ...filters, limit: 10000 }
      );

      if (transactions.length === 0) {
        throw createError('No transactions found for the specified criteria', 404);
      }

      const fileName = `transactions_${userId}_${Date.now()}.csv`;
      const filePath = path.join(process.cwd(), 'temp', fileName);

      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      const writer = csvWriter.createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'date', title: 'Date' },
          { id: 'description', title: 'Description' },
          { id: 'type', title: 'Type' },
          { id: 'amount', title: 'Amount' },
          { id: 'category', title: 'Category' },
          { id: 'createdAt', title: 'Created At' }
        ]
      });

      const records = transactions.map(transaction => ({
        date: transaction.date.toISOString().split('T')[0],
        description: transaction.description,
        type: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
        amount: parseFloat(transaction.amount.toString()).toFixed(2),
        category: transaction.category.name,
        createdAt: transaction.createdAt.toISOString()
      }));

      await writer.writeRecords(records);

      return filePath;
    } catch (error) {
      console.error('Error exporting transactions to CSV:', error);
      throw error;
    }
  }

  async exportSummaryToCSV(
    userId: string, 
    filters: TransactionFilters = {}
  ): Promise<string> {
    try {
      const summary = await this.transactionService.getTransactionsSummary(userId, filters);
      const categoryStats = await this.transactionService.getCategoryStats(userId, filters);

      const fileName = `summary_${userId}_${Date.now()}.csv`;
      const filePath = path.join(process.cwd(), 'temp', fileName);

      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      const writer = csvWriter.createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'metric', title: 'Metric' },
          { id: 'value', title: 'Value' }
        ]
      });

      const summaryRecords = [
        { metric: 'Total Income', value: summary.totalIncome.toFixed(2) },
        { metric: 'Total Expense', value: summary.totalExpense.toFixed(2) },
        { metric: 'Balance', value: summary.balance.toFixed(2) },
        { metric: 'Transaction Count', value: summary.transactionCount.toString() },
        { metric: '', value: '' },
        { metric: 'Category Breakdown', value: '' }
      ];

      categoryStats.forEach(stat => {
        summaryRecords.push({
          metric: stat.name,
          value: parseFloat(stat.total || 0).toFixed(2)
        });
      });

      await writer.writeRecords(summaryRecords);

      return filePath;
    } catch (error) {
      console.error('Error exporting summary to CSV:', error);
      throw error;
    }
  }

  deleteFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}