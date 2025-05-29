
export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: any;
}

export const notificationService = {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  showNotification(options: NotificationData): void {
    if (Notification.permission === 'granted') {
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon.png',
        tag: options.tag,
        data: options.data,
      });
    }
  },

  // Mock implementation for database notifications
  async getAllNotifications(userId: string, status?: 'unread' | 'read' | 'archived') {
    return [];
  },

  async getNotificationById(id: string) {
    return null;
  },

  async createNotification(notification: any) {
    return null;
  },

  async markAsRead(id: string) {
    return true;
  },

  async markAsUnread(id: string) {
    return true;
  },

  async archiveNotification(id: string) {
    return true;
  },

  async deleteNotification(id: string) {
    return true;
  },

  async getUnreadCount(userId: string) {
    return 0;
  },

  async markAllAsRead(userId: string) {
    return true;
  },

  async deleteOldNotifications(userId: string, days: number) {
    return 0;
  },
};
