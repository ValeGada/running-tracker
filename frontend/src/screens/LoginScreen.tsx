import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type Props = NativeStackScreenProps<any, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, loading } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      // Navigation is handled automatically by the auth state change
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Layout style={styles.container}>
        <View style={styles.content}>
          <Text category="h1" style={styles.title}>
            Welcome Back
          </Text>
          <Text category="s1" style={styles.subtitle}>
            Log in to continue tracking
          </Text>
          
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="your@email.com"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  status={errors.email ? 'danger' : 'basic'}
                  caption={errors.email?.message}
                  style={styles.input}
                />
              )}
            />
            
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  secureTextEntry
                  status={errors.password ? 'danger' : 'basic'}
                  caption={errors.password?.message}
                  style={styles.input}
                />
              )}
            />
            
            <Button
              size="large"
              style={styles.button}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
            
            <Button
              appearance="ghost"
              onPress={() => navigation.navigate('Register')}
            >
              Don't have an account? Sign Up
            </Button>
          </View>
        </View>
      </Layout>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 32,
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 16,
  },
});
