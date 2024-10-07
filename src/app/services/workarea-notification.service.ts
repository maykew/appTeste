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

  async sendNotification(isInside: boolean, latitude: number, longitude: number) {
      const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // Formata para ter dois dígitos
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Formata para ter dois dígitos


    const notificationMessage = isInside
      ? `Você está dentro da área! Localização: ${latitude}, ${longitude} Hora: ${hours}:${minutes}`
      : `Você está fora da área! Localização: ${latitude}, ${longitude} Hora: ${hours}:${minutes}`;

    // Armazena a mensagem no log
    this.notificationsLog.push(notificationMessage);

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Registro de Ponto',
          body: notificationMessage,
          id: 1,
          schedule: { at: new Date(Date.now() + 1000 * 5) }, // 5 seconds delay
        },
      ],
    });
  }
  
  async sendCustomNotification(title: string, description: string) {
    // Armazena a mensagem no log
    const notificationMessage = `${title}: ${description}`;
    this.notificationsLog.push(notificationMessage);
  
    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: description,
          id: new Date().getTime(), // Usando timestamp como ID único
          schedule: { at: new Date(Date.now() + 1000 * 5) }, // 5 segundos de atraso
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

