import request from 'supertest';
import express from 'express';
import { AuthController } from '../src/controllers/AuthController';
import { AuthService } from '../src/services/AuthService';

jest.mock('../src/services/AuthService');
jest.mock('../src/config/database');

const app = express();
app.use(express.json());

const authController = new AuthController();
app.post('/register', authController.register);
app.post('/login', authController.login);

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockAuthService = AuthService as jest.MockedClass<typeof AuthService>;
      mockAuthService.prototype.register = jest.fn().mockResolvedValue({
        user: mockUser,
        token: 'mock-jwt-token'
      });

      const response = await request(app)
        .post('/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toEqual(mockUser);
      expect(response.body.data.token).toBe('mock-jwt-token');
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          name: '',
          email: 'invalid-email',
          password: '123'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockAuthService = AuthService as jest.MockedClass<typeof AuthService>;
      mockAuthService.prototype.login = jest.fn().mockResolvedValue({
        user: mockUser,
        token: 'mock-jwt-token'
      });

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toEqual(mockUser);
      expect(response.body.data.token).toBe('mock-jwt-token');
    });

    it('should return 401 for invalid credentials', async () => {
      const mockAuthService = AuthService as jest.MockedClass<typeof AuthService>;
      mockAuthService.prototype.login = jest.fn().mockRejectedValue({
        statusCode: 401,
        message: 'Invalid credentials'
      });

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(500);
    });
  });
});