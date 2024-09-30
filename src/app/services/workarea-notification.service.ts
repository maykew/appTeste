import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class WorkareaNotificationService {
  private notificationsLog: string[] = [];  // Array para armazenar as notificações

  constructor(public alertController: AlertController) {}

  async requestPermissions() {
      return await LocalNotifications.requestPermissions();
  }

  async sendNotification(isInside: boolean, latitude: number, longitude: number, text: string) {
    const notificationMessage = isInside
      ? ` ${text} Localização: ${latitude}, ${longitude}`
      : `${text} Localização: ${latitude}, ${longitude}`;

    // Armazena a mensagem no log
    this.notificationsLog.push(notificationMessage);

    
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Registro de Ponto',
          body: notificationMessage,
          id: 1,
          schedule: { at: new Date(Date.now() + 1000 * 1) }, // 1 seconds delay
        },
      ],
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Método para obter todas as notificações
  getNotifications() {
    return this.notificationsLog;
  }


}
