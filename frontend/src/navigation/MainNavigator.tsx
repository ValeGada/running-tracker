import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { RunSessionScreen } from '../screens/RunSessionScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const HomeIcon = (props: any) => <Icon {...props} name="home-outline" />;
const RunIcon = (props: any) => <Icon {...props} name="activity-outline" />;
const SummaryIcon = (props: any) => <Icon {...props} name="bar-chart-outline" />;
const SettingsIcon = (props: any) => <Icon {...props} name="settings-outline" />;

const BottomTabBar = ({ navigation, state }: any) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.tabBarContainer,
      {
        paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 16) : insets.bottom,
      }
    ]}>
      <BottomNavigation
        selectedIndex={state.index}
        onSelect={(index) => navigation.navigate(state.routeNames[index])}
        style={styles.bottomNavigation}
      >
        <BottomNavigationTab title="Home" icon={HomeIcon} />
        <BottomNavigationTab title="Run" icon={RunIcon} />
        <BottomNavigationTab title="Summary" icon={SummaryIcon} />
        <BottomNavigationTab title="Settings" icon={SettingsIcon} />
      </BottomNavigation>
    </View>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Run" component={RunSessionScreen} />
      <Tab.Screen name="Summary" component={SummaryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E4E9F2',
  },
  bottomNavigation: {
    backgroundColor: 'white',
  },
});
