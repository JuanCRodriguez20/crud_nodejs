import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { CreateCategoryRequest, UpdateCategoryRequest, AuthenticatedRequest, ApiResponse } from '../types';
import { asyncHandler } from '../middlewares/errorHandler';

export class CategoryController {
  private categoryService = new CategoryService();

  createCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const categoryData: CreateCategoryRequest = req.body;
    const userId = req.user!.id.toString();
    
    const category = await this.categoryService.createCategory(categoryData, userId);

    const response: ApiResponse = {
      success: true,
      data: { category },
      message: 'Category created successfully'
    };

    res.status(201).json(response);
  });

  getCategories = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user!.id.toString();
    
    const categories = await this.categoryService.getUserCategories(userId);

    const response: ApiResponse = {
      success: true,
      data: { categories },
      message: 'Categories retrieved successfully'
    };

    res.status(200).json(response);
  });

  getCategoryById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!.id.toString();
    
    const category = await this.categoryService.getCategoryById(id, userId);

    const response: ApiResponse = {
      success: true,
      data: { category },
      message: 'Category retrieved successfully'
    };

    res.status(200).json(response);
  });

  updateCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdateCategoryRequest = req.body;
    const userId = req.user!.id.toString();
    
    const category = await this.categoryService.updateCategory(id, updateData, userId);

    const response: ApiResponse = {
      success: true,
      data: { category },
      message: 'Category updated successfully'
    };

    res.status(200).json(response);
  });

  deleteCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!.id.toString();
    
    await this.categoryService.deleteCategory(id, userId);

    const response: ApiResponse = {
      success: true,
      message: 'Category deleted successfully'
    };

    res.status(200).json(response);
  });
}