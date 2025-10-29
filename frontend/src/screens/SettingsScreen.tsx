import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Button, Card, Layout, Text, Toggle } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';

export const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const { 
    settings, 
    loading, 
    updateSetting,
    autoStartEnabled,
    notificationsEnabled,
    darkModeEnabled 
  } = useSettings();

  // Estados para controlar las animaciones de los toggles
  const [pendingToggles, setPendingToggles] = useState<{
    autoStart?: boolean;
    notifications?: boolean;
    darkMode?: boolean;
  }>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Función para obtener el valor actual del toggle (pendiente o real)
  const getToggleValue = (type: 'autoStart' | 'notifications' | 'darkMode') => {
    if (pendingToggles[type] !== undefined) {
      return pendingToggles[type];
    }
    switch (type) {
      case 'autoStart': return autoStartEnabled;
      case 'notifications': return notificationsEnabled;
      case 'darkMode': return darkModeEnabled;
      default: return false;
    }
  };



  const handleLogout = async () => {
    await logout();
  };

  const handleAutoStartToggle = async (checked: boolean) => {
    // Actualizar inmediatamente el estado pendiente
    setPendingToggles(prev => ({ ...prev, autoStart: checked }));
    setIsUpdating(true);
    
    try {
      await updateSetting('autoStart', checked);
      // Limpiar el estado pendiente después de la actualización exitosa
      setPendingToggles(prev => {
        const { autoStart, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      // En caso de error, revertir el estado pendiente
      setPendingToggles(prev => {
        const { autoStart, ...rest } = prev;
        return rest;
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotificationsToggle = async (checked: boolean) => {
    // Actualizar inmediatamente el estado pendiente
    setPendingToggles(prev => ({ ...prev, notifications: checked }));
    setIsUpdating(true);
    
    try {
      await updateSetting('notifications', checked);
      // Limpiar el estado pendiente después de la actualización exitosa
      setPendingToggles(prev => {
        const { notifications, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      // En caso de error, revertir el estado pendiente
      setPendingToggles(prev => {
        const { notifications, ...rest } = prev;
        return rest;
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDarkModeToggle = async (checked: boolean) => {
    // Actualizar inmediatamente el estado pendiente
    setPendingToggles(prev => ({ ...prev, darkMode: checked }));
    setIsUpdating(true);
    
    try {
      await updateSetting('darkMode', checked);
      // Limpiar el estado pendiente después de la actualización exitosa
      setPendingToggles(prev => {
        const { darkMode, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      // En caso de error, revertir el estado pendiente
      setPendingToggles(prev => {
        const { darkMode, ...rest } = prev;
        return rest;
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Layout style={[styles.container, { paddingTop: Platform.OS === 'android' ? Math.max(insets.top, 44) : insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text category="h3">Settings</Text>
          <Text category="s1" appearance="hint">
            Customize your experience
          </Text>
        </View>
        
        <Card style={styles.card}>
          <Text category="h6" style={styles.cardTitle}>
            Profile
          </Text>
          
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text category="h4">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            
            <View style={styles.userInfo}>
              <Text category="h6">{user?.name || 'User'}</Text>
              <Text category="s2" appearance="hint">
                {user?.email || 'user@example.com'}
              </Text>
            </View>
          </View>
        </Card>
        
        <Card style={styles.card}>
          <Text category="h6" style={styles.cardTitle}>
            Preferences
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text category="s1">Notifications</Text>
              <Text category="c1" appearance="hint">
                Receive run reminders and updates
              </Text>
            </View>
            <Toggle
              checked={getToggleValue('notifications')}
              onChange={handleNotificationsToggle}
              disabled={loading || isUpdating}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text category="s1">Dark Mode</Text>
              <Text category="c1" appearance="hint">
                Switch between light and dark theme
              </Text>
            </View>
            <Toggle
              checked={getToggleValue('darkMode')}
              onChange={handleDarkModeToggle}
              disabled={loading || isUpdating}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text category="s1">Auto-start Tracking</Text>
              <Text category="c1" appearance="hint">
                Start tracking automatically when movement is detected
              </Text>
            </View>
            <Toggle
              checked={getToggleValue('autoStart')}
              onChange={handleAutoStartToggle}
              disabled={loading || isUpdating}
            />
          </View>
        </Card>
        
        <Card style={styles.card}>
          <Text category="h6" style={styles.cardTitle}>
            About
          </Text>
          
          <View style={styles.aboutRow}>
            <Text category="s1">Version</Text>
            <Text category="s1" appearance="hint">
              1.0.0
            </Text>
          </View>
          
          <View style={styles.aboutRow}>
            <Text category="s1">Developer</Text>
            <Text category="s1" appearance="hint">
              Running Tracker Team
            </Text>
          </View>
        </Card>
        
        <Button
          size="large"
          status="danger"
          appearance="outline"
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          Logout
        </Button>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DC3760',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 8,
  },
});
