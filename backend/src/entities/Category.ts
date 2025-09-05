import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsOptional, IsHexColor } from 'class-validator';
import { User } from './User';
import { Transaction } from './Transaction';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @IsNotEmpty({ message: 'Category name is required' })
  name: string;

  @Column({ length: 500, nullable: true })
  @IsOptional()
  description?: string;

  @Column({ length: 7, default: '#6366f1' })
  @IsOptional()
  @IsHexColor({ message: 'Color must be a valid hex color' })
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, user => user.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[];
}