import { AppError } from '../utils/AppError';

export class ModerationService {
  private spamKeywords = ['spam', 'scam', 'fake', 'click here', 'free money'];
  private profanityFilter = ['bad', 'word']; // Simplified - use proper profanity filter in production

  async autoModerate(content: string): Promise<{ approved: boolean; reason?: string }> {
    const lowerContent = content.toLowerCase();

    // Check for spam keywords
    if (this.spamKeywords.some((keyword) => lowerContent.includes(keyword))) {
      return {
        approved: false,
        reason: 'Content contains spam keywords',
      };
    }

    // Check for profanity
    if (this.profanityFilter.some((word) => lowerContent.includes(word))) {
      return {
        approved: false,
        reason: 'Content contains inappropriate language',
      };
    }

    // Check content length
    if (content.length < 3) {
      return {
        approved: false,
        reason: 'Content is too short',
      };
    }

    return { approved: true };
  }
}

export const moderationService = new ModerationService();
export default moderationService;
