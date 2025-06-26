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
      console.log('Making verification request to:', `${API_BASE_URL}/users/verify-token`);

      // First verify the token
      const response = await fetch(`${API_BASE_URL}/users/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailString,
          token: otpString
        }),
      });

      console.log('Verification response status:', response.status);
      const data = await response.json();
      console.log('Verification response data:', data);

      if (response.ok && data.status === 200) {
        console.log('Token verified successfully!');

        // Get temporary data for account creation
        const tempData = await getTempUserData();
        console.log('Retrieved temp data for account creation:', tempData);

        if (tempData) {
          console.log('Updating account with verified email and temp password...');

          // Update the user account - include all required fields
          const updateResponse = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(tempData.email)}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: tempData.name || tempData.email, // Use stored name or fallback to email
              email: tempData.email, // Include email as required
              password: tempData.password,
              verified: true
            }),
          });

          console.log('Account update response status:', updateResponse.status);
          
          const updateData = await updateResponse.json();
          console.log('Account update response data:', updateData);

          if (updateResponse.ok) {
            console.log('Account updated successfully');
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
            console.error('Failed to update account:', updateData);
            throw new Error(updateData.message || 'Failed to update account');
          }
        } else {
          console.error('No temporary data found');
          throw new Error('No signup data found. Please start over.');
        }
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
      const response = await fetch(`${API_BASE_URL}/users/request-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailString,
        }),
      });

      if (response.ok) {
        setTimeLeft(300); // 5 minutes
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
        Alert.alert('Success', 'New verification code sent');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend code');
      }
    } catch (error) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message?: string }).message)
          : 'Failed to resend code';
      Alert.alert('Error', errorMessage);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <LinearGradient
      colors={[
        "#DFC1FD",
        "#f3e8ff",
        "#F5ECFE",
        "#F5ECFE",
        "#e9d5ff",
        "#DFC1FD",
      ]}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView className="flex-1 mt-7">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="px-5 pt-2">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 justify-center items-center"
              >
                <Ionicons name="chevron-back" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Title and Description */}
            <View className="px-7 mt-5">
              <Text className="text-black font-extrabold text-3xl">
                Verify Account
              </Text>
              <Text className="text-gray-600 mt-3 text-base leading-6">
                Enter the 4-digit code sent to you when registering the child to the institute.
              </Text>
            </View>

            {/* OTP Input Fields */}
            <View className="flex-row justify-center items-center mt-10 px-7">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  style={{
                    backgroundColor: "white",
                    borderRadius: 12,
                    width: 60,
                    height: 60,
                    fontSize: 24,
                    fontWeight: '600',
                    borderWidth: 2,
                    borderColor: digit ? "#7c3aed" : "transparent",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    marginHorizontal: 8,
                  }}
                />
              ))}
            </View>

            {/* Timer and Resend */}
            <View className="flex-row justify-center items-center mt-8">
              {timeLeft > 0 ? (
                <Text className="text-gray-600 text-center">
                  Code expires in {formatTime(timeLeft)}
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOtp}>
                  <Text className="text-purple-600 font-semibold text-center underline">
                    Resend Code
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify Button */}
            <View className="mx-7 mt-10">
              <TouchableOpacity
                onPress={handleVerifyOtp}
                disabled={isLoading || !isOtpComplete}
                className={`rounded-3xl py-4 items-center ${isLoading || !isOtpComplete ? "bg-purple-400" : "bg-purple-600"
                  }`}
                style={{
                  shadowColor: "#7c3aed",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text className="text-white text-lg font-semibold">
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Help Text */}
            <View className="px-7 mt-6">
              <Text className="text-gray-500 text-center text-sm">
                Didn't receive the code? Check your messages or contact the institute for assistance.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default AccountVerification;