import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { LoginRequest, RegisterRequest, AuthenticatedRequest, ApiResponse } from '../types';
import { asyncHandler } from '../middlewares/errorHandler';

export class AuthController {
  private authService = new AuthService();

  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userData: RegisterRequest = req.body;
    
    const { user, token } = await this.authService.register(userData);

    const response: ApiResponse = {
      success: true,
      data: { user, token },
      message: 'User registered successfully'
    };

    res.status(201).json(response);
  });

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const credentials: LoginRequest = req.body;
    
    const { user, token } = await this.authService.login(credentials);

    const response: ApiResponse = {
      success: true,
      data: { user, token },
      message: 'Login successful'
    };

    res.status(200).json(response);
  });

  getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = req.user!;

    const response: ApiResponse = {
      success: true,
      data: { user },
      message: 'Profile retrieved successfully'
    };

    res.status(200).json(response);
  });

  refreshToken = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = req.user!;
    const authService = new AuthService();
    
    const newToken = (authService as any).generateToken(user);

    const response: ApiResponse = {
      success: true,
      data: { token: newToken },
      message: 'Token refreshed successfully'
    };

    res.status(200).json(response);
  });
}