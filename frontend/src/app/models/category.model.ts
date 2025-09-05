export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
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