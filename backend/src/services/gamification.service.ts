import User from '../models/User';
import { AppError } from '../utils/AppError';

export class GamificationService {
  async awardPoints(userId: string, action: string, points: number) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.gamification.points += points;
    
    // Calculate level (1 point = 1 level, can be adjusted)
    const newLevel = Math.floor(user.gamification.points / 100) + 1;
    if (newLevel > user.gamification.level) {
      user.gamification.level = newLevel;
    }

    await user.save();
    return user.gamification;
  }

  async getUserStats(userId: string) {
    const user = await User.findById(userId).select('gamification');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user.gamification;
  }
}

export const gamificationService = new GamificationService();
export default gamificationService;
