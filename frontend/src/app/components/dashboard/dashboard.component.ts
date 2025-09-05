import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';
import { TransactionSummary, CategoryStats, TransactionFilters } from '../../models/transaction.model';
import { Category } from '../../models/category.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef<HTMLCanvasElement>;

  private destroy$ = new Subject<void>();
  private categoryChart?: Chart;
  private monthlyChart?: Chart;

  // Data properties
  summary: TransactionSummary = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0
  };
  
  categoryStats: CategoryStats[] = [];
  categories: Category[] = [];
  loading = true;
  error: string | null = null;

  // Filter properties
  filters: TransactionFilters = {
    startDate: this.getThreeMonthsAgo(),
    endDate: this.getToday()
  };

  // Date string properties for form binding
  startDateString: string = '';
  endDateString: string = '';

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initializeDateStrings();
    this.loadDashboardData();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Load summary
    this.transactionService.getTransactionsSummary(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.summary = {
              totalIncome: response.data.summary.totalIncome || 0,
              totalExpense: response.data.summary.totalExpense || 0,
              balance: response.data.summary.balance || 0,
              transactionCount: response.data.summary.transactionCount || 0
            };
          }
        },
        error: (error) => {
          this.error = 'Error loading summary data';
          console.error('❌ Error loading summary:', error);
        }
      });

    // Load category stats
    this.transactionService.getCategoryStats(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.categoryStats = response.data.stats.map(stat => ({
              id: stat.id || 0,
              name: stat.name || 'Sin nombre',
              color: stat.color || '#6366f1',
              total: stat.total || 0,
              count: stat.count || 0,
              type: stat.type
            }));
            this.createCategoryChart();
            this.createMonthlyChart();
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error loading category statistics';
          this.loading = false;
          console.error('❌ Error loading category stats:', error);
        }
      });
  }

  private initializeDateStrings(): void {
    if (this.filters.startDate && this.filters.endDate) {
      this.startDateString = this.formatDateForInput(this.filters.startDate);
      this.endDateString = this.formatDateForInput(this.filters.endDate);
    }
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onStartDateChange(): void {
    if (this.startDateString) {
      this.filters.startDate = new Date(this.startDateString);
      this.loadDashboardData();
    }
  }

  onEndDateChange(): void {
    if (this.endDateString) {
      this.filters.endDate = new Date(this.endDateString);
      this.loadDashboardData();
    }
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

  private createCategoryChart(): void {
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }

    setTimeout(() => {
      const ctx = this.categoryChartRef?.nativeElement?.getContext('2d');
      if (!ctx || this.categoryStats.length === 0) return;

      const expenseStats = this.categoryStats.filter(stat => stat.total > 0);
      
      this.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: expenseStats.map(stat => stat.name),
          datasets: [{
            data: expenseStats.map(stat => stat.total),
            backgroundColor: expenseStats.map(stat => stat.color || this.generateColor()),
            borderWidth: 3,
            borderColor: '#ffffff',
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 12
                },
                generateLabels: (chart) => {
                  const data = chart.data;
                  if (data.labels?.length && data.datasets.length) {
                    return data.labels.map((label, index) => {
                      const dataset = data.datasets[0];
                      const value = dataset.data[index] as number;
                      const total = expenseStats.reduce((sum, stat) => sum + stat.total, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      
                      return {
                        text: `${label}: $${value.toFixed(2)} (${percentage}%)`,
                        fillStyle: Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[index] : dataset.backgroundColor || '#6366f1',
                        strokeStyle: Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[index] : dataset.backgroundColor || '#6366f1',
                        pointStyle: 'circle'
                      };
                    });
                  }
                  return [];
                }
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed;
                  const total = expenseStats.reduce((sum, stat) => sum + stat.total, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
                }
              },
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: 'white',
              bodyColor: 'white',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1
            }
          },
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000
          }
        }
      });

      // Add center text with total
      this.addCenterText(ctx, expenseStats.reduce((sum, stat) => sum + stat.total, 0));
    });
  }

  private addCenterText(ctx: CanvasRenderingContext2D, total: number): void {
    const canvas = ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Total amount
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#1f2937';
    ctx.fillText('Total', centerX, centerY - 10);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#059669';
    ctx.fillText(`$${total.toFixed(2)}`, centerX, centerY + 10);
    
    ctx.restore();
  }

  private generateColor(): string {
    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
      '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
      '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
      '#ec4899', '#f43f5e'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private createMonthlyChart(): void {
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }

    setTimeout(() => {
      const ctx = this.monthlyChartRef?.nativeElement?.getContext('2d');
      if (!ctx) return;

      // Use summary data for income vs expense comparison
      const totalIncome = this.summary.totalIncome;
      const totalExpense = this.summary.totalExpense;

      this.monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Ingresos', 'Gastos', 'Balance'],
          datasets: [{
            label: 'Monto ($)',
            data: [totalIncome, totalExpense, this.summary.balance],
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',
              'rgba(239, 68, 68, 0.8)', 
              this.summary.balance >= 0 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(245, 158, 11, 0.8)'
            ],
            borderColor: [
              'rgb(16, 185, 129)',
              'rgb(239, 68, 68)',
              this.summary.balance >= 0 ? 'rgb(59, 130, 246)' : 'rgb(245, 158, 11)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed.y;
                  const label = context.label;
                  if (label === 'Balance') {
                    return `${label}: ${value >= 0 ? '+' : ''}$${value.toFixed(2)}`;
                  }
                  return `${label}: $${value.toFixed(2)}`;
                }
              },
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: 'white',
              bodyColor: 'white'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `$${value}`,
                color: '#6b7280'
              },
              grid: {
                color: 'rgba(107, 114, 128, 0.1)'
              }
            },
            x: {
              ticks: {
                color: '#6b7280',
                font: {
                  weight: 'bold'
                }
              },
              grid: {
                display: false
              }
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          }
        }
      });
    });
  }

  onFilterChange(): void {
    this.loadDashboardData();
  }

  exportSummary(): void {
    this.transactionService.exportSummary(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `resumen-financiero-${new Date().toISOString().split('T')[0]}.csv`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error exporting summary:', error);
        }
      });
  }

  exportTransactions(): void {
    this.transactionService.exportTransactions(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `transacciones-${new Date().toISOString().split('T')[0]}.csv`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error exporting transactions:', error);
        }
      });
  }

  private getFirstDayOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  private getLastDayOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  private getThreeMonthsAgo(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 2, 1);
  }

  private getToday(): Date {
    return new Date();
  }

  get balanceColor(): string {
    return this.summary.balance >= 0 ? 'text-green-600' : 'text-red-600';
  }

  // Helper for template
  get Math() {
    return Math;
  }

  debugDashboard(): void {
    console.log('🔍 DASHBOARD DEBUG INFO:');
    console.log('📅 Current filters:', this.filters);
    console.log('📊 Current summary:', this.summary);
    console.log('🏷️ Current category stats:', this.categoryStats);
    console.log('👤 Is user authenticated:', !!localStorage.getItem('token'));
    console.log('🔑 Token:', localStorage.getItem('token'));
    
    // Force reload
    this.loadDashboardData();
  }
}