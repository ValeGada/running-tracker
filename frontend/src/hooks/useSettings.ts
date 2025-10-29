import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState, AppDispatch } from '../store/store';
import { 
  loadSettings, 
  saveSettings, 
  updateSetting, 
  updateSettings, 
  resetSettings, 
  clearError 
} from '../store/settingsSlice';
import { UserSettings } from '../types';

export const useSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading, error } = useSelector((state: RootState) => state.settings);

  // Cargar configuraciones al inicializar el hook
  useEffect(() => {
    dispatch(loadSettings());
  }, [dispatch]);

  // Función para actualizar una configuración específica
  const updateUserSetting = async (key: keyof UserSettings, value: any) => {
    try {
      // Actualizar en el estado local primero
      dispatch(updateSetting({ key, value }));
      
      // Crear el objeto de configuraciones actualizado
      const updatedSettings = { ...settings, [key]: value };
      
      // Guardar en AsyncStorage
      await dispatch(saveSettings(updatedSettings)).unwrap();
      
      console.log(`Setting ${key} updated to:`, value);
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      // Revertir el cambio local si falla el guardado
      dispatch(updateSetting({ key, value: settings[key] }));
    }
  };

  // Función para actualizar múltiples configuraciones
  const updateUserSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      // Actualizar en el estado local primero
      dispatch(updateSettings(newSettings));
      
      // Crear el objeto de configuraciones actualizado
      const updatedSettings = { ...settings, ...newSettings };
      
      // Guardar en AsyncStorage
      await dispatch(saveSettings(updatedSettings)).unwrap();
      
      console.log('Settings updated:', newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      // Revertir los cambios locales si falla el guardado
      dispatch(loadSettings());
    }
  };

  // Función para resetear configuraciones
  const resetUserSettings = async () => {
    try {
      dispatch(resetSettings());
      await dispatch(saveSettings({
        units: 'metric',
        notifications: true,
        darkMode: false,
        autoStart: false,
      })).unwrap();
      
      console.log('Settings reset to defaults');
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  // Función para limpiar errores
  const clearSettingsError = () => {
    dispatch(clearError());
  };

  return {
    // Estado
    settings,
    loading,
    error,
    
    // Funciones
    updateSetting: updateUserSetting,
    updateSettings: updateUserSettings,
    resetSettings: resetUserSettings,
    clearError: clearSettingsError,
    
    // Configuraciones específicas para fácil acceso
    autoStartEnabled: settings.autoStart,
    notificationsEnabled: settings.notifications,
    darkModeEnabled: settings.darkMode,
    units: settings.units,
  };
};