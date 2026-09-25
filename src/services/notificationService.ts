import { AppNotification, NotificationType } from '../types/messenger';
import { appStorage } from '../utils/storage';
import { soundManager } from '../utils/sound';

class NotificationService {
  public getNotifications(): AppNotification[] {
    return appStorage.getNotifications();
  }

  public getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.isRead).length;
  }

  public addNotification(type: NotificationType, title: string, body: string, linkChatId?: string, avatar?: string): AppNotification {
    const notifs = appStorage.getNotifications();
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      type,
      title,
      body,
      timestamp: new Date().toISOString(),
      isRead: false,
      linkChatId,
      avatar
    };

    const updated = [newNotif, ...notifs];
    appStorage.saveNotifications(updated);
    soundManager.playNotification();
    return newNotif;
  }

  public markAsRead(id: string): void {
    const notifs = appStorage.getNotifications().map(n => (n.id === id ? { ...n, isRead: true } : n));
    appStorage.saveNotifications(notifs);
  }

  public markAllAsRead(): void {
    const notifs = appStorage.getNotifications().map(n => ({ ...n, isRead: true }));
    appStorage.saveNotifications(notifs);
  }

  public clearAll(): void {
    appStorage.saveNotifications([]);
  }
}

export const notificationService = new NotificationService();
