import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Transaction } from '../entities/Transaction';
import { Category } from '../entities/Category';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_PATH || 'database/dashboard.sqlite',
  synchronize: true,
  logging: true,
  entities: [User, Transaction, Category],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Initializing database...');
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
    
    // Force synchronization
    if (AppDataSource.options.synchronize) {
      console.log('🔄 Synchronizing database schema...');
      await AppDataSource.synchronize();
      console.log('✅ Database schema synchronized');
    }
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    throw error;
  }
};