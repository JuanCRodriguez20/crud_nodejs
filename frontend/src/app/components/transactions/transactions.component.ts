import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';
import { Transaction, CreateTransactionRequest, TransactionFilters } from '../../models/transaction.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  transactions: Transaction[] = [];
  categories: Category[] = [];
  loading = false;
  error: string | null = null;
  showCreateForm = false;
  editingTransaction: Transaction | null = null;

  // Forms
  transactionForm: FormGroup;

  // Pagination
  currentPage = 1;
  totalTransactions = 0;
  itemsPerPage = 10;

  // Filters
  filters: TransactionFilters = {};
  filterStartDate: string = '';
  filterEndDate: string = '';

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) {
    this.transactionForm = this.createTransactionForm();
  }

  ngOnInit(): void {
    this.loadTransactions();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createTransactionForm(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      type: ['expense', Validators.required],
      categoryId: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  private loadTransactions(): void {
    this.loading = true;
    this.error = null;

    const searchFilters: TransactionFilters = {
      ...this.filters,
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    this.transactionService.getTransactions(searchFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.transactions = response.data.transactions;
            this.totalTransactions = response.data.total;
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error loading transactions';
          this.loading = false;
          console.error('Error loading transactions:', error);
        }
      });
  }

  private loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.categories = response.data.categories;
          }
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const transactionData: CreateTransactionRequest = {
        description: formValue.description,
        amount: Number(formValue.amount),
        type: formValue.type,
        categoryId: Number(formValue.categoryId),
        date: new Date(formValue.date)
      };

      if (this.editingTransaction) {
        this.updateTransaction(this.editingTransaction.id, transactionData);
      } else {
        this.createTransaction(transactionData);
      }
    }
  }

  private createTransaction(transactionData: CreateTransactionRequest): void {
    this.transactionService.createTransaction(transactionData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTransactions();
            this.resetForm();
          }
        },
        error: (error) => {
          this.error = 'Error creating transaction';
          console.error('Error creating transaction:', error);
        }
      });
  }

  private updateTransaction(id: number, transactionData: CreateTransactionRequest): void {
    this.transactionService.updateTransaction(id.toString(), transactionData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTransactions();
            this.resetForm();
          }
        },
        error: (error) => {
          this.error = 'Error updating transaction';
          console.error('Error updating transaction:', error);
        }
      });
  }

  editTransaction(transaction: Transaction): void {
    this.editingTransaction = transaction;
    this.showCreateForm = true;
    
    this.transactionForm.patchValue({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      categoryId: transaction.categoryId,
      date: new Date(transaction.date).toISOString().split('T')[0]
    });
  }

  deleteTransaction(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      this.transactionService.deleteTransaction(id.toString())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadTransactions();
            }
          },
          error: (error) => {
            this.error = 'Error deleting transaction';
            console.error('Error deleting transaction:', error);
          }
        });
    }
  }

  resetForm(): void {
    this.transactionForm.reset();
    this.transactionForm.patchValue({
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
    this.showCreateForm = false;
    this.editingTransaction = null;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }

  onFilterChange(): void {
    // Convert categoryId string to number for the filter
    if (this.filters.categoryId) {
      this.filters.categoryId = +this.filters.categoryId;
    }
    this.currentPage = 1;
    this.loadTransactions();
  }

  onDateFilterChange(): void {
    // Update the filters object with the date values
    this.filters.startDate = this.filterStartDate ? new Date(this.filterStartDate) : undefined;
    this.filters.endDate = this.filterEndDate ? new Date(this.filterEndDate) : undefined;
    
    this.currentPage = 1;
    this.loadTransactions();
  }

  clearFilters(): void {
    this.filters = {};
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.currentPage = 1;
    this.loadTransactions();
  }

  get totalPages(): number {
    return Math.ceil(this.totalTransactions / this.itemsPerPage);
  }

  get isFormValid(): boolean {
    return this.transactionForm.valid;
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  getCategoryColor(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.color : '#6366f1';
  }

  // Helper for template
  get Math() {
    return Math;
  }
}