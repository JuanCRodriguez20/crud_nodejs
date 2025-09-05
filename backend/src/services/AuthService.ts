import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { LoginRequest, RegisterRequest, JwtPayload } from '../types';
import { createError } from '../middlewares/errorHandler';
import { validateEntity } from '../middlewares/validation';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw createError('User already exists with this email', 400);
    }

    const user = this.userRepository.create(userData);
    
    const validationErrors = await validateEntity(user);
    if (validationErrors.length > 0) {
      throw createError(validationErrors.join(', '), 400);
    }

    await this.userRepository.save(user);

    const token = this.generateToken(user);

    return { user, token };
  }

  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: credentials.email }
    });

    if (!user || !(await user.validatePassword(credentials.password))) {
      throw createError('Invalid email or password', 401);
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    return user;
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (error) {
      throw createError('Invalid token', 401);
    }
  }
}