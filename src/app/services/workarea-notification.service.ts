import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class WorkareaNotificationService {
  private notificationsLog: string[] = []; // Array para armazenar as notificações

  constructor(public alertController: AlertController) {}

  // Solicitar permissões de notificações
  async requestPermissions() {
    if (Capacitor.isNativePlatform()) {
      // Solicita permissão no ambiente nativo
      const permissionStatus = await LocalNotifications.requestPermissions();
      
      // Retorna um objeto com a chave 'granted' para manter a consistência
      return { granted: permissionStatus.display === 'granted' };
    } else {
      // Solicita permissão para web notifications
      if (Notification.permission === 'granted') {
        return { granted: true };
      } else if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        return { granted: permission === 'granted' };
      } else {
        return { granted: false };
      }
    }
  }

  // Enviar notificação
  async sendNotification(isInside: boolean, latitude: number, longitude: number, text: string) {
    const notificationMessage = isInside
      ? ` ${text}  \n Localização: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      : `${text}  \n Localização: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

    // Armazena a mensagem no log
    this.notificationsLog.push(notificationMessage);

    if (Capacitor.isNativePlatform()) {
      // Notificações nativas no ambiente móvel
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Registro de Ponto',
            body: notificationMessage,
            id: 1,
            schedule: { at: new Date(Date.now() + 1000 * 1) }, // 1 segundo de atraso
          },
        ],
      });
    } else {
      // Notificações via Web Notification API
      if (Notification.permission === 'granted') {
        new Notification('Registro de Ponto', {
          body: notificationMessage,
        });
      } else {
        console.warn('As permissões de notificação não foram concedidas.');
      }
    }
  }

  // Exibe um alerta (funciona para ambos web e nativo)
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
