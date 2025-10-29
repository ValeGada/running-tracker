import { useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { startRun } from '../store/runSlice';
import { useSettings } from './useSettings';
import { ActivityDetectionService, ActivityData } from '../services/activityDetectionService';
import { notificationService } from '../services/NotificationService';
import { Run } from '../types';

export const useAutoStart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings } = useSettings();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [movementDetected, setMovementDetected] = useState(false);
  const [movementIntensity, setMovementIntensity] = useState(0);
  const [isWaitingForAutoStart, setIsWaitingForAutoStart] = useState(false);
  
  const movementStartTime = useRef<number | null>(null);
  const lastAutoStartTime = useRef<number>(0);
  const autoStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef<((data: ActivityData) => void) | null>(null);
  
  const MOVEMENT_DELAY = 3000; // 3 segundos de movimiento continuo
  const COOLDOWN_PERIOD = 30000; // 30 segundos entre auto-starts

  useEffect(() => {
    const initializeServices = async () => {
      // Inicializar servicio de notificaciones
      await notificationService.initialize();
      
      if (settings.autoStart) {
        startMonitoring();
      } else {
        stopMonitoring();
      }
    };

    initializeServices();
  }, [settings.autoStart]);

  const startMonitoring = async () => {
    try {
      const available = await ActivityDetectionService.isAvailable();
      if (!available) {
        console.warn('Accelerometer not available');
        return;
      }

      const hasPermission = await ActivityDetectionService.requestPermissions();
      if (!hasPermission) {
        console.warn('Motion permissions not granted');
        return;
      }

      // Crear callback para manejar los datos de actividad
      const activityCallback = (data: ActivityData) => {
        setMovementIntensity(data.intensity);
        
        if (data.intensity > 0.3) { // Umbral de movimiento
          if (!movementDetected) {
            setMovementDetected(true);
            movementStartTime.current = Date.now();
            setIsWaitingForAutoStart(true);
            
            // Programar auto-start después del delay
            autoStartTimeoutRef.current = setTimeout(() => {
              triggerAutoStart();
            }, MOVEMENT_DELAY);
          }
        } else {
          if (movementDetected) {
            setMovementDetected(false);
            setIsWaitingForAutoStart(false);
            movementStartTime.current = null;
            
            // Cancelar auto-start si se detiene el movimiento
            if (autoStartTimeoutRef.current) {
              clearTimeout(autoStartTimeoutRef.current);
              autoStartTimeoutRef.current = null;
            }
          }
        }
      };

      callbackRef.current = activityCallback;
      const success = await ActivityDetectionService.startDetection(activityCallback);
      
      if (success) {
        setIsMonitoring(true);
      }
    } catch (error) {
      console.error('Error starting activity monitoring:', error);
    }
  };

  const stopMonitoring = async () => {
    if (callbackRef.current) {
      ActivityDetectionService.stopDetection(callbackRef.current);
      callbackRef.current = null;
    }
    setIsMonitoring(false);
    setMovementDetected(false);
    setIsWaitingForAutoStart(false);
    movementStartTime.current = null;
    
    if (autoStartTimeoutRef.current) {
      clearTimeout(autoStartTimeoutRef.current);
      autoStartTimeoutRef.current = null;
    }
  };

  const triggerAutoStart = async () => {
    const now = Date.now();
    
    // Verificar cooldown
    if (now - lastAutoStartTime.current < COOLDOWN_PERIOD) {
      setIsWaitingForAutoStart(false);
      return;
    }

    setIsWaitingForAutoStart(false);
    lastAutoStartTime.current = now;

    // Mostrar notificación
    await notificationService.showAutoStartNotification();

    // Mostrar alerta de confirmación
    Alert.alert(
      '🏃‍♂️ Auto-start Detectado',
      'Se detectó actividad física. ¿Deseas iniciar el seguimiento de tu carrera?',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {
            console.log('Auto-start cancelled by user');
          }
        },
        {
          text: 'Sí, iniciar',
          onPress: async () => {
            console.log('Auto-start confirmed by user');
            
            // Crear un nuevo run
            const newRun: Run = {
              id: Date.now().toString(),
              userId: 'current-user', // TODO: obtener del estado de auth
              startTime: Date.now(),
              endTime: 0, // 0 indica que la carrera está activa
              distance: 0,
              duration: 0,
              route: [],
              averagePace: 0,
              maxSpeed: 0,
              calories: 0,
              status: 'active'
            };
            
            dispatch(startRun(newRun));
            await notificationService.showRunStartedNotification();
          }
        }
      ],
      { cancelable: true }
    );
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  return {
    isMonitoring,
    movementDetected,
    movementIntensity,
    isWaitingForAutoStart,
    autoStartEnabled: settings.autoStart,
    startMonitoring,
    stopMonitoring,
  };
};