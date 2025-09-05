import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoryService } from '../../services/category.service';
import { Category, CreateCategoryRequest } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  categories: Category[] = [];
  loading = false;
  error: string | null = null;
  showCreateForm = false;
  editingCategory: Category | null = null;

  // Form
  categoryForm: FormGroup;

  // Predefined colors
  predefinedColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', 
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#64748b', '#6b7280', '#374151'
  ];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.createCategoryForm();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createCategoryForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      color: ['#6366f1', Validators.required]
    });
  }

  private loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.categories = response.data.categories;
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error loading categories';
          this.loading = false;
          console.error('Error loading categories:', error);
        }
      });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      const categoryData: CreateCategoryRequest = {
        name: formValue.name,
        description: formValue.description || undefined,
        color: formValue.color
      };

      if (this.editingCategory) {
        this.updateCategory(this.editingCategory.id, categoryData);
      } else {
        this.createCategory(categoryData);
      }
    }
  }

  private createCategory(categoryData: CreateCategoryRequest): void {
    this.categoryService.createCategory(categoryData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.loadCategories();
            this.resetForm();
          }
        },
        error: (error) => {
          this.error = 'Error creating category';
          console.error('Error creating category:', error);
        }
      });
  }

  private updateCategory(id: number, categoryData: CreateCategoryRequest): void {
    this.categoryService.updateCategory(id.toString(), categoryData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.loadCategories();
            this.resetForm();
          }
        },
        error: (error) => {
          this.error = 'Error updating category';
          console.error('Error updating category:', error);
        }
      });
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.showCreateForm = true;
    
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description || '',
      color: category.color
    });
  }

  deleteCategory(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer.')) {
      this.categoryService.deleteCategory(id.toString())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadCategories();
            }
          },
          error: (error) => {
            this.error = 'Error deleting category. It might be in use by transactions.';
            console.error('Error deleting category:', error);
          }
        });
    }
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.categoryForm.patchValue({ color: '#6366f1' });
    this.showCreateForm = false;
    this.editingCategory = null;
  }

  selectColor(color: string): void {
    this.categoryForm.patchValue({ color });
  }

  get isFormValid(): boolean {
    return this.categoryForm.valid;
  }

  get selectedColor(): string {
    return this.categoryForm.get('color')?.value || '#6366f1';
  }
}