import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
type Props = NativeStackScreenProps<any, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register, loading } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const onSubmit = async (data: RegisterFormData) => {
    const success = await register(data.name, data.email, data.password);
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
        <ScrollView contentContainerStyle={styles.content}>
          <Text category="h1" style={styles.title}>
            Create Account
          </Text>
          <Text category="s1" style={styles.subtitle}>
            Start your running journey today
          </Text>
          
          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  status={errors.name ? 'danger' : 'basic'}
                  caption={errors.name?.message}
                  style={styles.input}
                />
              )}
            />
            
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
                  placeholder="Create a password"
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
            
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  secureTextEntry
                  status={errors.confirmPassword ? 'danger' : 'basic'}
                  caption={errors.confirmPassword?.message}
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            
            <Button
              appearance="ghost"
              onPress={() => navigation.navigate('Login')}
            >
              Already have an account? Log In
            </Button>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
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
