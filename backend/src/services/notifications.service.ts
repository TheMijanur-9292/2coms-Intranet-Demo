// Placeholder for notification service
// In production, integrate with email service, push notifications, etc.

export class NotificationService {
  async create(userId: string, notification: {
    type: string;
    title: string;
    message: string;
    link?: string;
    relatedId?: string;
  }) {
    // TODO: Implement notification creation
    console.log(`Notification for user ${userId}:`, notification);
    return notification;
  }

  async createMentions(userIds: string[], notification: {
    type: string;
    title: string;
    message: string;
    link?: string;
    relatedId?: string;
  }) {
    // TODO: Create notifications for multiple users
    userIds.forEach((userId) => {
      this.create(userId, notification);
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
