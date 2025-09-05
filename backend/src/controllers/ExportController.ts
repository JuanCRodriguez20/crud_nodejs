import { Response } from 'express';
import { ExportService } from '../services/ExportService';
import { TransactionFilters, AuthenticatedRequest, ApiResponse } from '../types';
import { asyncHandler } from '../middlewares/errorHandler';
import path from 'path';

export class ExportController {
  private exportService = new ExportService();

  exportTransactions = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const filters: TransactionFilters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      type: req.query.type as 'income' | 'expense' | undefined,
      categoryId: req.query.categoryId as string | undefined,
    };

    const filePath = await this.exportService.exportTransactionsToCSV(userId, filters);
    const fileName = path.basename(filePath);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      setTimeout(() => {
        this.exportService.deleteFile(filePath);
      }, 5000);
    });
  });

  exportSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const filters: TransactionFilters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      categoryId: req.query.categoryId as string | undefined,
    };

    const filePath = await this.exportService.exportSummaryToCSV(userId, filters);
    const fileName = path.basename(filePath);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      setTimeout(() => {
        this.exportService.deleteFile(filePath);
      }, 5000);
    });
  });
}