import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../types';
import { createError } from '../middlewares/errorHandler';
import { validateEntity } from '../middlewares/validation';

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async createCategory(categoryData: CreateCategoryRequest, userId: string): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: categoryData.name, userId }
    });

    if (existingCategory) {
      throw createError('Category with this name already exists', 400);
    }

    const category = this.categoryRepository.create({
      ...categoryData,
      userId
    });

    const validationErrors = await validateEntity(category);
    if (validationErrors.length > 0) {
      throw createError(validationErrors.join(', '), 400);
    }

    return await this.categoryRepository.save(category);
  }

  async getUserCategories(userId: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { userId },
      order: { name: 'ASC' }
    });
  }

  async getCategoryById(id: string, userId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, userId }
    });

    if (!category) {
      throw createError('Category not found', 404);
    }

    return category;
  }

  async updateCategory(
    id: string, 
    updateData: UpdateCategoryRequest, 
    userId: string
  ): Promise<Category> {
    const category = await this.getCategoryById(id, userId);

    if (updateData.name && updateData.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateData.name, userId }
      });

      if (existingCategory) {
        throw createError('Category with this name already exists', 400);
      }
    }

    Object.assign(category, updateData);

    const validationErrors = await validateEntity(category);
    if (validationErrors.length > 0) {
      throw createError(validationErrors.join(', '), 400);
    }

    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    const category = await this.getCategoryById(id, userId);

    const transactionCount = await AppDataSource.query(
      'SELECT COUNT(*) as count FROM transactions WHERE category_id = $1',
      [id]
    );

    if (parseInt(transactionCount[0].count) > 0) {
      throw createError('Cannot delete category with existing transactions', 400);
    }

    await this.categoryRepository.remove(category);
  }
}