import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import { HomeScreen } from '../screens/HomeScreen';
import { RunSessionScreen } from '../screens/RunSessionScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const HomeIcon = (props: any) => <Icon {...props} name="home-outline" />;
const RunIcon = (props: any) => <Icon {...props} name="activity-outline" />;
const SummaryIcon = (props: any) => <Icon {...props} name="bar-chart-outline" />;
const SettingsIcon = (props: any) => <Icon {...props} name="settings-outline" />;

const BottomTabBar = ({ navigation, state }: any) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title="Home" icon={HomeIcon} />
    <BottomNavigationTab title="Run" icon={RunIcon} />
    <BottomNavigationTab title="Summary" icon={SummaryIcon} />
    <BottomNavigationTab title="Settings" icon={SettingsIcon} />
  </BottomNavigation>
);

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
