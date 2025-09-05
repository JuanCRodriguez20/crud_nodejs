import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsPositive, IsIn, IsOptional, IsDateString } from 'class-validator';
import { User } from './User';
import { Category } from './Category';

export type TransactionType = 'income' | 'expense';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @Column('real')
  @IsPositive({ message: 'Amount must be positive' })
  amount: number;

  @Column({ length: 50 })
  @IsIn(['income', 'expense'], { message: 'Type must be either income or expense' })
  type: TransactionType;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDateString()
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, user => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Category, category => category.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}