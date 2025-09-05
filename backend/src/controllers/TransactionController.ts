import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';
import { 
  CreateTransactionRequest, 
  UpdateTransactionRequest, 
  TransactionFilters,
  AuthenticatedRequest, 
  ApiResponse 
} from '../types';
import { asyncHandler } from '../middlewares/errorHandler';

export class TransactionController {
  private transactionService = new TransactionService();

  createTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const transactionData: CreateTransactionRequest = req.body;
    const userId = req.user!.id.toString();
    
    const transaction = await this.transactionService.createTransaction(transactionData, userId);

    const response: ApiResponse = {
      success: true,
      data: { transaction },
      message: 'Transaction created successfully'
    };

    res.status(201).json(response);
  });

  getTransactions = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id.toString();
    const filters: TransactionFilters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      type: req.query.type as 'income' | 'expense' | undefined,
      categoryId: req.query.categoryId as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };
    
    const result = await this.transactionService.getUserTransactions(userId, filters);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Transactions retrieved successfully'
    };

    res.status(200).json(response);
  });

  getTransactionById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!.id.toString();
    
    const transaction = await this.transactionService.getTransactionById(id, userId);

    const response: ApiResponse = {
      success: true,
      data: { transaction },
      message: 'Transaction retrieved successfully'
    };

    res.status(200).json(response);
  });

  updateTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdateTransactionRequest = req.body;
    const userId = req.user!.id.toString();
    
    const transaction = await this.transactionService.updateTransaction(id, updateData, userId);

    const response: ApiResponse = {
      success: true,
      data: { transaction },
      message: 'Transaction updated successfully'
    };

    res.status(200).json(response);
  });

  deleteTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!.id.toString();
    
    await this.transactionService.deleteTransaction(id, userId);

    const response: ApiResponse = {
      success: true,
      message: 'Transaction deleted successfully'
    };

    res.status(200).json(response);
  });

  getTransactionsSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id.toString();
    
    const filters: TransactionFilters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      categoryId: req.query.categoryId as string | undefined,
    };
    
    const summary = await this.transactionService.getTransactionsSummary(userId, filters);

    const response: ApiResponse = {
      success: true,
      data: { summary },
      message: 'Transaction summary retrieved successfully'
    };

    res.status(200).json(response);
  });

  getCategoryStats = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id.toString();
    const filters: TransactionFilters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      type: req.query.type as 'income' | 'expense' | undefined,
    };
    
    const stats = await this.transactionService.getCategoryStats(userId, filters);

    const response: ApiResponse = {
      success: true,
      data: { stats },
      message: 'Category statistics retrieved successfully'
    };

    res.status(200).json(response);
  });
}