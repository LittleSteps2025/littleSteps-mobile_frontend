import { images } from "@/assets/images/images";
import CustomAlert from '@/components/CustomAlert';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { API_BASE_URL } from '@/utility';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
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
  View
} from "react-native";

// Safe JSON parsing function
const safeJsonParse = async (response: Response) => {
  const text = await response.text();

  if (!text || text.trim() === "") {
    throw new Error("Empty response from server");
  }

  // Check if response starts with HTML
  if (text.trim().startsWith("<")) {
    throw new Error(
      "Server returned HTML instead of JSON. Check if the endpoint exists."
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error("Failed to parse JSON:", text);
    throw new Error("Invalid JSON response from server");
  }
};

function RestorePassword() {
  const { customAlert, showCustomAlert, hideCustomAlert } = useCustomAlert();
  const { email } = useLocalSearchParams();
  const emailString = Array.isArray(email) ? email[0] : email;
  
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      showCustomAlert("error", "Error", "Please enter the complete 4-digit code");
      return;
    }

    if (!emailString) {
      showCustomAlert("error", "Error", "Email not found. Please start the reset process again.");
      return;
    }

    setIsLoading(true);

    try {
      console.log('Verifying reset code for:', emailString);
      console.log('Code entered:', otpString);
      
      // Verify code with database
      const response = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailString,
          code: otpString
        })
      });

      console.log('Verify code response status:', response.status);
      
      const data = await safeJsonParse(response);
      console.log('Verify code response data:', data);
      
      if (response.ok && (data.status === 200 || data.success)) {
        // Code verified successfully, navigate to new password page
        showCustomAlert(
          "success", 
          "Code Verified", 
          "Your code has been verified successfully!",
          false,
          () => router.push(`/new_password?email=${emailString}&resetToken=${data.resetToken}`)
        );
      } else {
        throw new Error(data.message || 'Invalid or expired code');
      }
    } catch (error: any) {
      console.error('Code verification error:', error);
      
      let errorMessage = 'Invalid code. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('HTML instead of JSON')) {
          errorMessage = 'Server configuration error. Please contact support.';
        } else if (error.message.includes('Empty response')) {
          errorMessage = 'No response from server. Please check your internet connection.';
        } else if (error.message.includes('Invalid JSON')) {
          errorMessage = 'Server returned invalid data. Please try again or contact support.';
        } else if (error.message.includes('expired')) {
          errorMessage = 'Code has expired. Please request a new one.';
        } else if (error.message.includes('invalid')) {
          errorMessage = 'Invalid code. Please check and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      showCustomAlert("error", "Verification Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!emailString) {
      showCustomAlert("error", "Error", "Email not found. Please start the reset process again.");
      return;
    }

    setIsLoading(true);

    try {
      // Request new code from backend
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailString
        })
      });

      const data = await safeJsonParse(response);
      
      if (response.ok && (data.status === 200 || data.success)) {
        showCustomAlert(
          "success",
          "Code Sent",
          "A new verification code has been sent to your email."
        );
        setTimeLeft(600); // Reset timer to 10 minutes
        setOtp(["", "", "", ""]); // Clear current OTP
        inputRefs.current[0]?.focus(); // Focus first input
      } else {
        throw new Error(data.message || 'Failed to send new code');
      }
    } catch (error: any) {
      console.error('Resend code error:', error);
      showCustomAlert("error", "Error", "Failed to send new code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

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
                Enter the 4-digit code
              </Text>
              <Text className="text-gray-600 mt-3 text-base leading-6">
                We&apos;ve sent the code to your email, check your inbox.
              </Text>
            </View>

            <View className="justify-center items-center">
              <Image className="w-60 h-60 " source={images.otp} />
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
                    fontWeight: "600",
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
                  This OTP will be available during {formatTime(timeLeft)}
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
                  isLoading || !isOtpComplete
                    ? "bg-purple-400"
                    : "bg-purple-600"
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
                  {isLoading ? "Verifying..." : "Reset Password"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Help Text */}
            <View className="px-7 mt-6">
              <Text className="text-gray-500 text-center text-sm">
                Didn&apos;t receive the code? Check your messages or contact the
                institute for assistance.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <CustomAlert
        visible={customAlert.visible}
        type={customAlert.type}
        title={customAlert.title}
        message={customAlert.message}
        showCancelButton={customAlert.showCancelButton}
        onConfirm={customAlert.onConfirm}
        onClose={hideCustomAlert}
      />
    </LinearGradient>
  );
}

export default RestorePassword;
