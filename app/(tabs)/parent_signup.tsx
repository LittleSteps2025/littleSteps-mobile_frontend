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

type SignUpStep = 'email' | 'password' | 'otp' | 'firebase';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export default function ParentSignUp() {
  const router = useRouter();
  const { setParentData } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<SignUpStep>('email');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [parentName, setParentName] = useState('');

  // Step 1: Verify Email
  const verifyEmail = async () => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!isValidEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.VERIFY_EMAIL, {
        method: 'POST',
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.status === 200) {
        setParentName(response.data.name);
        setCurrentStep('password');
        Alert.alert('Success', 'Email verified! Please set your password.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Set Password and Verify OTP
  const setPasswordAndVerifyOTP = async () => {
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setCurrentStep('otp');
  };

  // Step 3: Verify OTP
  const verifyOTP = async () => {
    if (!formData.otp.trim() || formData.otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          password: formData.password,
        }),
      });

      if (response.status === 200) {
        setCurrentStep('firebase');
        Alert.alert('Success', 'OTP verified! Creating your account...');
        await createFirebaseAccount();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Create Firebase Account
  const createFirebaseAccount = async () => {
    setLoading(true);
    try {
      // Create Firebase user
      const userCredential = await auth.createUserWithEmailAndPassword(
        formData.email,
        formData.password
      );

      // Get Firebase ID token
      const idToken = await userCredential.user?.getIdToken();

      // Complete registration on backend
      const response = await apiRequest(API_CONFIG.ENDPOINTS.COMPLETE_REGISTRATION, {
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

        Alert.alert(
          'Welcome to LittleSteps!',
          'Your account has been created successfully.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/dashboard'),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Firebase registration error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'An account with this email already exists');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'Password is too weak');
      } else {
        Alert.alert('Error', error.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    setLoading(true);
    try {
      await apiRequest(API_CONFIG.ENDPOINTS.RESEND_OTP, {
        method: 'POST',
        body: JSON.stringify({ email: formData.email }),
      });
      Alert.alert('Success', 'OTP has been resent to your email');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const renderEmailStep = () => (
    <View className="flex-1 justify-center px-6">
      <View className="mb-8">
        <Text className="text-white text-3xl font-bold text-center mb-2">
          Welcome to LittleSteps
        </Text>
        <Text className="text-white/80 text-lg text-center">
          Enter your email to get started
        </Text>
      </View>

      <View className="mb-6">
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

      <TouchableOpacity
        className={`bg-white py-4 rounded-2xl ${loading ? 'opacity-50' : ''}`}
        onPress={verifyEmail}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#4CAF50" />
        ) : (
          <Text className="text-green-600 text-lg font-bold text-center">
            Verify Email
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6"
        onPress={() => router.push('/signin')}
      >
        <Text className="text-white text-center">
          Already have an account?{' '}
          <Text className="font-bold underline">Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPasswordStep = () => (
    <View className="flex-1 justify-center px-6">
      <View className="mb-8">
        <Text className="text-white text-3xl font-bold text-center mb-2">
          Hello {parentName}!
        </Text>
        <Text className="text-white/80 text-lg text-center">
          Set your password to secure your account
        </Text>
      </View>

      <View className="mb-4">
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

      <View className="mb-6">
        <Text className="text-white text-base font-medium mb-2">
          Confirm Password
        </Text>
        <View className="relative">
          <TextInput
            className="bg-white/20 text-white text-base px-4 py-4 pr-12 rounded-2xl border border-white/30"
            placeholder="Confirm your password"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={24}
              color="rgba(255,255,255,0.6)"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        className="bg-white py-4 rounded-2xl mb-4"
        onPress={setPasswordAndVerifyOTP}
      >
        <Text className="text-green-600 text-lg font-bold text-center">
          Continue
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCurrentStep('email')}>
        <Text className="text-white text-center">
          <Text className="underline">Back to Email</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOTPStep = () => (
    <View className="flex-1 justify-center px-6">
      <View className="mb-8">
        <Text className="text-white text-3xl font-bold text-center mb-2">
          Check Your Email
        </Text>
        <Text className="text-white/80 text-lg text-center mb-4">
          We've sent a 6-digit verification code to
        </Text>
        <Text className="text-white font-bold text-center">
          {formData.email}
        </Text>
      </View>

      <View className="mb-6">
        <Text className="text-white text-base font-medium mb-2">
          Verification Code
        </Text>
        <TextInput
          className="bg-white/20 text-white text-base px-4 py-4 rounded-2xl border border-white/30 text-center"
          placeholder="Enter 6-digit code"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={formData.otp}
          onChangeText={(text) => setFormData({ ...formData, otp: text })}
          keyboardType="numeric"
          maxLength={6}
          autoComplete="one-time-code"
        />
      </View>

      <TouchableOpacity
        className={`bg-white py-4 rounded-2xl mb-4 ${loading ? 'opacity-50' : ''}`}
        onPress={verifyOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#4CAF50" />
        ) : (
          <Text className="text-green-600 text-lg font-bold text-center">
            Verify Code
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="mb-4"
        onPress={resendOTP}
        disabled={loading}
      >
        <Text className="text-white text-center underline">
          Didn't receive the code? Resend
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCurrentStep('password')}>
        <Text className="text-white text-center">
          <Text className="underline">Back</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFirebaseStep = () => (
    <View className="flex-1 justify-center px-6">
      <View className="mb-8 items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white text-xl font-bold text-center mt-4">
          Setting up your account...
        </Text>
        <Text className="text-white/80 text-center mt-2">
          Please wait while we finalize your registration
        </Text>
      </View>
    </View>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 'email':
        return renderEmailStep();
      case 'password':
        return renderPasswordStep();
      case 'otp':
        return renderOTPStep();
      case 'firebase':
        return renderFirebaseStep();
      default:
        return renderEmailStep();
    }
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
            {getCurrentStepContent()}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
