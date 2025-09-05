import 'reflect-metadata';

jest.setTimeout(30000);

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_USERNAME = 'test';
  process.env.DB_PASSWORD = 'test';
  process.env.DB_DATABASE = 'test_db';
});

afterAll(async () => {
  
});