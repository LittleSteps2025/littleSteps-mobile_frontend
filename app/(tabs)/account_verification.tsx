import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";

function AccountVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(86400); // 1 day
  // Fix: Properly type the useRef for TextInput array
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format time display - Fixed calculation
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

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit code');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to next screen on success
      router.push("/signin");
    } catch (error) {
      Alert.alert('Error', 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    Alert.alert('Code Sent', 'A new verification code has been sent to your device.');
    setTimeLeft(86400); // Reset timer to 1 day
    setOtp(['', '', '', '']); // Clear current OTP
    inputRefs.current[0]?.focus(); // Focus first input
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
                className={`rounded-3xl py-4 items-center ${
                  isLoading || !isOtpComplete ? "bg-purple-400" : "bg-purple-600"
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