import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import authService from '../services/auth.service';
import { AuthRequest } from '../types/express';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'Registration successful.',
    data: { userId: user._id },
  });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json({ success: true, message: 'Login successful.', data: result });
});

export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.id);
  res.json({ success: true, data: { user } });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.updateProfile(req.user!.id, req.body);
  res.json({ success: true, message: 'Profile updated successfully.', data: { user } });
});
