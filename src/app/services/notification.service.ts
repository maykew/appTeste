import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationHistory: string[] = [];

  constructor() {}

  addNotification(notification: string) {
    this.notificationHistory.push(notification);
  }

  getNotifications(): string[] {
    return this.notificationHistory;
  }
}
