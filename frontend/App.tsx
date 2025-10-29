import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { customTheme } from './src/theme/theme';
import { notificationService } from './src/services/NotificationService';

function AppContent() {
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

  return (
    <SafeAreaProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <Provider store={store}>
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...customTheme }}>
          <AppContent />
        </ApplicationProvider>
      </Provider>
    </>
  );
}
