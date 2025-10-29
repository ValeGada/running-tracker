import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../types';

// Configuraciones por defecto
const defaultSettings: UserSettings = {
  units: 'metric',
  notifications: true,
  darkMode: false,
  autoStart: false,
};

// Clave para AsyncStorage
const SETTINGS_STORAGE_KEY = 'userSettings';

// Thunk para cargar configuraciones desde AsyncStorage
export const loadSettings = createAsyncThunk(
  'settings/loadSettings',
  async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        return JSON.parse(storedSettings) as UserSettings;
      }
      return defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  }
);

// Thunk para guardar configuraciones en AsyncStorage
export const saveSettings = createAsyncThunk(
  'settings/saveSettings',
  async (settings: UserSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      return settings;
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }
);

interface SettingsState {
  settings: UserSettings;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: defaultSettings,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Actualizar configuración específica
    updateSetting: (state, action: PayloadAction<{ key: keyof UserSettings; value: any }>) => {
      const { key, value } = action.payload;
      state.settings[key] = value;
    },
    
    // Actualizar múltiples configuraciones
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    // Resetear configuraciones a valores por defecto
    resetSettings: (state) => {
      state.settings = defaultSettings;
    },
    
    // Limpiar errores
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cargar configuraciones
      .addCase(loadSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load settings';
      })
      // Guardar configuraciones
      .addCase(saveSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save settings';
      });
  },
});

export const { updateSetting, updateSettings, resetSettings, clearError } = settingsSlice.actions;
export default settingsSlice.reducer;