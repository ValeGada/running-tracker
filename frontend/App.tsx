import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './src/store/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { customLightTheme, customDarkTheme } from './src/theme/theme';
import { notificationService } from './src/services/NotificationService';

// Componente interno que tiene acceso al store
function ThemedAppContent() {
  const darkModeEnabled = useSelector((state: RootState) => state.settings.settings.darkMode);
  
  useEffect(() => {
    // Inicializar servicios al arrancar la app
    const initializeServices = async () => {
      try {
        await notificationService.initialize();
        console.log('Services initialized successfully');
      } catch (error) {
        console.error('Error initializing services:', error);
      }
    };

    initializeServices();
  }, []);

  // Seleccionar el tema basado en la configuración
  const evaTheme = darkModeEnabled ? eva.dark : eva.light;
  const customTheme = darkModeEnabled ? customDarkTheme : customLightTheme;

  return (
    <ApplicationProvider {...eva} theme={{ ...evaTheme, ...customTheme }}>
      <SafeAreaProvider>
        <RootNavigator />
        <StatusBar style={darkModeEnabled ? "light" : "dark"} />
      </SafeAreaProvider>
    </ApplicationProvider>
  );
}

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <Provider store={store}>
        <ThemedAppContent />
      </Provider>
    </>
  );
}
