import React from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Button, Card, Layout, Text, Toggle } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [autoStartEnabled, setAutoStartEnabled] = React.useState(false);
  
  const handleLogout = async () => {
    await logout();
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
              checked={notificationsEnabled}
              onChange={setNotificationsEnabled}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text category="s1">Dark Mode</Text>
              <Text category="c1" appearance="hint">
                Use dark theme (coming soon)
              </Text>
            </View>
            <Toggle
              checked={darkModeEnabled}
              onChange={setDarkModeEnabled}
              disabled
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text category="s1">Auto-start Tracking</Text>
              <Text category="c1" appearance="hint">
                Start tracking automatically
              </Text>
            </View>
            <Toggle
              checked={autoStartEnabled}
              onChange={setAutoStartEnabled}
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
    paddingTop: 60,
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
