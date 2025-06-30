import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebase';
import { apiRequest, API_CONFIG } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';

interface FormData {
  email: string;
  password: string;
}

export default function ParentSignIn() {
  const router = useRouter();
  const { setParentData } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    if (!isValidEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Sign in with Firebase
      const userCredential = await auth.signInWithEmailAndPassword(
        formData.email,
        formData.password
      );

      // Get Firebase ID token
      const idToken = await userCredential.user?.getIdToken();

      // Authenticate with backend
      const response = await apiRequest(API_CONFIG.ENDPOINTS.FIREBASE_LOGIN, {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      });

      if (response.status === 200) {
        // Store parent data
        setParentData({
          parentId: response.data.parentId,
          email: response.data.email,
          name: response.data.name,
          verified: response.data.verified,
        });

        // Navigate to dashboard
        router.replace('/dashboard');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No account found with this email address');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid email address');
      } else if (error.code === 'auth/user-disabled') {
        Alert.alert('Error', 'This account has been disabled');
      } else if (error.message && error.message.includes('registration not completed')) {
        Alert.alert(
          'Registration Incomplete',
          'Your account registration is not completed. Please complete the sign-up process.',
          [
            {
              text: 'Complete Registration',
              onPress: () => router.push('/parent_signup'),
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else {
        Alert.alert('Error', error.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4CAF50', '#45a049', '#2E7D32']}
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 justify-center px-6">
              <View className="mb-8">
                <Text className="text-white text-3xl font-bold text-center mb-2">
                  Welcome Back
                </Text>
                <Text className="text-white/80 text-lg text-center">
                  Sign in to your LittleSteps account
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-white text-base font-medium mb-2">
                  Email Address
                </Text>
                <TextInput
                  className="bg-white/20 text-white text-base px-4 py-4 rounded-2xl border border-white/30"
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View className="mb-6">
                <Text className="text-white text-base font-medium mb-2">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="bg-white/20 text-white text-base px-4 py-4 pr-12 rounded-2xl border border-white/30"
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-4"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="rgba(255,255,255,0.6)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                className={`bg-white py-4 rounded-2xl mb-4 ${loading ? 'opacity-50' : ''}`}
                onPress={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#4CAF50" />
                ) : (
                  <Text className="text-green-600 text-lg font-bold text-center">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="mb-6"
                onPress={() => router.push('/forgot_password')}
              >
                <Text className="text-white text-center underline">
                  Forgot your password?
                </Text>
              </TouchableOpacity>

              <View className="border-t border-white/20 pt-6">
                <Text className="text-white/80 text-center mb-4">
                  Don't have an account yet?
                </Text>
                <TouchableOpacity
                  className="border border-white/30 py-4 rounded-2xl"
                  onPress={() => router.push('/parent_signup')}
                >
                  <Text className="text-white text-lg font-bold text-center">
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mt-8">
                <Text className="text-white/60 text-xs text-center">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
