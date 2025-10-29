import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  private static instance: NotificationService;
  private hasPermission = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      // Solicitar permisos
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      this.hasPermission = finalStatus === 'granted';

      if (!this.hasPermission) {
        console.warn('Notification permissions not granted');
        return false;
      }

      // Configurar canal de notificación para Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('running-tracker', {
          name: 'Running Tracker',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#DC3760',
        });
      }

      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  async showAutoStartNotification(): Promise<void> {
    if (!this.hasPermission) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🏃‍♂️ Auto-start Activado',
          body: 'Se detectó actividad física. ¿Iniciar seguimiento?',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Mostrar inmediatamente
      });
    } catch (error) {
      console.error('Error showing auto-start notification:', error);
    }
  }

  async showRunStartedNotification(): Promise<void> {
    if (!this.hasPermission) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🏃‍♂️ Seguimiento Iniciado',
          body: 'Tu sesión de running ha comenzado. ¡A correr!',
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing run started notification:', error);
    }
  }

  async showRunCompletedNotification(distance: number, duration: number): Promise<void> {
    if (!this.hasPermission) return;

    try {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const distanceKm = (distance / 1000).toFixed(2);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎉 ¡Sesión Completada!',
          body: `Distancia: ${distanceKm} km • Tiempo: ${minutes}:${seconds.toString().padStart(2, '0')}`,
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing run completed notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();