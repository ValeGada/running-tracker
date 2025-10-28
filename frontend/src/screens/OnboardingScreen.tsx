import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Onboarding'>;

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text category="h1" style={styles.icon}>
            🏃‍♂️
          </Text>
        </View>
        
        <Text category="h1" style={styles.title}>
          Running Tracker
        </Text>
        
        <Text category="s1" style={styles.subtitle}>
          Track your runs, reach your goals, and stay motivated
        </Text>
        
        <View style={styles.features}>
          <Text category="p1" style={styles.feature}>
            📍 Real-time GPS tracking
          </Text>
          <Text category="p1" style={styles.feature}>
            📊 Detailed statistics
          </Text>
          <Text category="p1" style={styles.feature}>
            🗺️ Route visualization
          </Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          size="large"
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          Get Started
        </Button>
        
        <Button
          size="large"
          appearance="ghost"
          style={styles.button}
          onPress={() => navigation.navigate('Register')}
        >
          Create Account
        </Button>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.7,
  },
  features: {
    alignItems: 'flex-start',
  },
  feature: {
    marginVertical: 8,
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
  },
  button: {
    marginBottom: 12,
  },
});
