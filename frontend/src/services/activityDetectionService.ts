import { Accelerometer } from 'expo-sensors';
import { Subscription } from 'expo-sensors/build/Pedometer';

export interface ActivityData {
  isMoving: boolean;
  intensity: number; // 0-1 scale
  timestamp: number;
}

export class ActivityDetectionService {
  private static subscription: Subscription | null = null;
  private static isListening = false;
  private static callbacks: ((data: ActivityData) => void)[] = [];
  
  // Configuración de sensibilidad
  private static readonly MOVEMENT_THRESHOLD = 0.1; // Umbral de movimiento
  private static readonly HIGH_INTENSITY_THRESHOLD = 0.3; // Umbral de alta intensidad
  private static readonly UPDATE_INTERVAL = 1000; // Intervalo de actualización en ms
  
  // Buffer para suavizar las lecturas
  private static accelerationBuffer: number[] = [];
  private static readonly BUFFER_SIZE = 5;

  /**
   * Solicitar permisos para sensores
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Accelerometer.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting accelerometer permissions:', error);
      return false;
    }
  }

  /**
   * Verificar disponibilidad del acelerómetro
   */
  static async isAvailable(): Promise<boolean> {
    try {
      return await Accelerometer.isAvailableAsync();
    } catch (error) {
      console.error('Error checking accelerometer availability:', error);
      return false;
    }
  }

  /**
   * Iniciar detección de actividad
   */
  static async startDetection(callback: (data: ActivityData) => void): Promise<boolean> {
    try {
      // Verificar permisos y disponibilidad
      const hasPermissions = await this.requestPermissions();
      const isAvailable = await this.isAvailable();
      
      if (!hasPermissions || !isAvailable) {
        console.warn('Accelerometer not available or permissions denied');
        return false;
      }

      // Agregar callback
      this.callbacks.push(callback);

      // Si ya está escuchando, no iniciar de nuevo
      if (this.isListening) {
        return true;
      }

      // Configurar intervalo de actualización
      Accelerometer.setUpdateInterval(this.UPDATE_INTERVAL);

      // Iniciar suscripción
      this.subscription = Accelerometer.addListener((accelerometerData) => {
        this.processAccelerometerData(accelerometerData);
      });

      this.isListening = true;
      console.log('Activity detection started');
      return true;
    } catch (error) {
      console.error('Error starting activity detection:', error);
      return false;
    }
  }

  /**
   * Detener detección de actividad
   */
  static stopDetection(callback?: (data: ActivityData) => void): void {
    try {
      // Remover callback específico o todos
      if (callback) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
      } else {
        this.callbacks = [];
      }

      // Si aún hay callbacks, mantener la detección activa
      if (this.callbacks.length > 0) {
        return;
      }

      // Detener suscripción
      if (this.subscription) {
        this.subscription.remove();
        this.subscription = null;
      }

      this.isListening = false;
      this.accelerationBuffer = [];
      console.log('Activity detection stopped');
    } catch (error) {
      console.error('Error stopping activity detection:', error);
    }
  }

  /**
   * Procesar datos del acelerómetro
   */
  private static processAccelerometerData(data: { x: number; y: number; z: number }): void {
    try {
      // Calcular magnitud de aceleración (sin gravedad)
      const magnitude = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z) - 1.0;
      const normalizedMagnitude = Math.abs(magnitude);

      // Agregar al buffer
      this.accelerationBuffer.push(normalizedMagnitude);
      if (this.accelerationBuffer.length > this.BUFFER_SIZE) {
        this.accelerationBuffer.shift();
      }

      // Calcular promedio suavizado
      const averageMagnitude = this.accelerationBuffer.reduce((sum, val) => sum + val, 0) / this.accelerationBuffer.length;

      // Determinar si hay movimiento
      const isMoving = averageMagnitude > this.MOVEMENT_THRESHOLD;
      
      // Calcular intensidad (0-1)
      const intensity = Math.min(averageMagnitude / this.HIGH_INTENSITY_THRESHOLD, 1.0);

      // Crear datos de actividad
      const activityData: ActivityData = {
        isMoving,
        intensity,
        timestamp: Date.now(),
      };

      // Notificar a todos los callbacks
      this.callbacks.forEach(callback => {
        try {
          callback(activityData);
        } catch (error) {
          console.error('Error in activity detection callback:', error);
        }
      });
    } catch (error) {
      console.error('Error processing accelerometer data:', error);
    }
  }

  /**
   * Obtener estado actual de la detección
   */
  static getStatus(): { isListening: boolean; callbackCount: number } {
    return {
      isListening: this.isListening,
      callbackCount: this.callbacks.length,
    };
  }
}