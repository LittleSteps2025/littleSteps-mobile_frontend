import { API_BASE_URL } from '@/utility/index';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from "react-native";

function AccountVerification() {
  const { email } = useLocalSearchParams();
  const emailString = Array.isArray(email) ? email[0] : email;

  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(86400); // 1 day
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Get temporary user data
  const getTempUserData = async () => {
    try {
      const tempData = await AsyncStorage.getItem('tempUserData');
      if (tempData) {
        return JSON.parse(tempData);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving temp data:', error);
      return null;
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');

    console.log('=== Verification Process ===');
    console.log('Email:', emailString);
    console.log('Entered OTP:', otpString);

    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit code');
      return;
    }

    setIsLoading(true);

    try {
      // Get temporary data for password
      const tempData = await getTempUserData();
      console.log('Retrieved temp data:', tempData);

      if (!tempData) {
        throw new Error('No signup data found. Please start over.');
      }

      console.log('Making verification request to:', `${API_BASE_URL}/users/verify-token`);

      // Verify token and set password in one call
      const response = await fetch(`${API_BASE_URL}/users/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailString,
          token: otpString,
          password: tempData.password // Send password along with token
        }),
      });

      console.log('Verification response status:', response.status);
      const data = await response.json();
      console.log('Verification response data:', data);

      if (response.ok && data.status === 200) {
        console.log('Token verified and password set successfully!');

        // Clear temporary data
        await AsyncStorage.removeItem('tempUserData');
        console.log('Temporary data cleared');

        Alert.alert('Success', 'Account verified and password set successfully!', [
          {
            text: 'Continue',
            onPress: () => router.push("/signin")
          }
        ]);
      } else {
        // Handle verification failure
        console.error('Verification failed:', data);
        throw new Error(data.message || 'Invalid or expired verification code');
      }

    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message?: string }).message)
          : 'Verification failed';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      Alert.alert('Info', 'Please contact administrator for a new verification code.');
    } catch (error) {
      console.error('Resend error:', error);
      Alert.alert('Error', 'Failed to resend code');
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <LinearGradient
      colors={['#DFC1FD', '#f3e8ff', '#F5ECFE', '#F5ECFE', '#e9d5ff', '#DFC1FD']}
      start={[0, 0]}
      end={[1, 1]}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={{ flex: 1, marginTop: 28 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Ionicons name="chevron-back" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
              <Text style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: '#374151',
                marginBottom: 8
              }}>
                Account Verification
              </Text>
              <Text style={{
                fontSize: 16,
                color: '#6b7280',
                marginBottom: 32
              }}>
                Enter the 4-digit code to verify your account
              </Text>

              {/* Email Display */}
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                padding: 16,
                borderRadius: 12,
                marginBottom: 24
              }}>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280',
                  marginBottom: 4
                }}>
                  Verification code for:
                </Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {emailString}
                </Text>
              </View>

              {/* OTP Input */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 24
              }}>
                {[0, 1, 2, 3].map((index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    value={otp[index]}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    style={{
                      width: 70,
                      height: 70,
                      backgroundColor: 'white',
                      borderRadius: 12,
                      textAlign: 'center',
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#374151',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3
                    }}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {/* Timer */}
              <View style={{
                alignItems: 'center',
                marginBottom: 24
              }}>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280',
                  marginBottom: 4
                }}>
                  Time remaining
                </Text>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: timeLeft > 300 ? '#22c55e' : '#ef4444'
                }}>
                  {formatTime(timeLeft)}
                </Text>
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                onPress={handleVerifyOtp}
                disabled={!isOtpComplete || isLoading}
                style={{
                  backgroundColor: isOtpComplete && !isLoading ? '#7c3aed' : '#9ca3af',
                  borderRadius: 24,
                  paddingVertical: 16,
                  alignItems: 'center',
                  marginBottom: 16,
                  shadowColor: '#7c3aed',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isOtpComplete ? 0.3 : 0,
                  shadowRadius: 8,
                  elevation: isOtpComplete ? 4 : 0
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: '600'
                }}>
                  {isLoading ? 'Verifying...' : 'Verify Account'}
                </Text>
              </TouchableOpacity>

              {/* Resend Button */}
              <TouchableOpacity
                onPress={handleResendOtp}
                style={{
                  alignItems: 'center',
                  paddingVertical: 12
                }}
              >
                <Text style={{
                  color: '#7c3aed',
                  fontSize: 16,
                  fontWeight: '600'
                }}>
                  Didn't receive the code? Contact Admin
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default AccountVerification;
