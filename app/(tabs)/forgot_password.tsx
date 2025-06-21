import { images } from "@/assets/images/images";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

type FormData = {
  email: string;
};

type FormField = keyof FormData;

type FormErrors = {
  [K in FormField]?: string | null;
};

type TouchedFields = {
  [K in FormField]?: boolean;
};

function ForgotPassword() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  // Real-time validation
  const validateField = (field: FormField, value: string) => {
    let error = null;

    switch (field) {
      case "email":
        error = validateEmail(value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return error === null;
  };

  // Handle input change
  const handleInputChange = (field: FormField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate if field has been touched
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // Handle input blur (when user leaves the field)
  const handleBlur = (field: FormField) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
    validateField(field, formData[field]);
  };

  // Validate entire form
  const validateForm = () => {
    const emailError = validateEmail(formData.email);

    const newErrors: FormErrors = {
      email: emailError,
    };

    setErrors(newErrors);
    setTouched({
      email: true,
    });

    return !emailError;
  };

  // Handle form submission
  const handleForgotPassword = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors below");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success
      Alert.alert("Success", "Please check your email!", [
        {
          text: "Continue",
          onPress: () => router.push("/restore_password"), // Changed from dashboard to login
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

            <View className="px-5 pt-5">
              <Text className="text-3xl font-bold text-gray-700 mb-2">
                Forgot Password
              </Text>
              <Text className="text-base text-gray-500 mb-8">
                Enter your email to receive a password reset link
              </Text>
              <View className="justify-center items-center">
                <Image className="w-60 h-60 " source={images.forgot} />
              </View>
              {/* Email Input */}
              <Text className="text-base text-gray-700 mb-2 font-medium">
                Email
              </Text>
              <View className="mb-1">
                <TextInput
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    backgroundColor: "white",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    fontSize: 16,
                    borderWidth: errors.email && touched.email ? 2 : 0,
                    borderColor:
                      errors.email && touched.email ? "#ef4444" : "transparent",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              </View>
              {errors.email && touched.email && (
                <Text className="text-red-500 text-sm mb-4 ml-1">
                  {errors.email}
                </Text>
              )}
              {!errors.email && touched.email && formData.email && (
                <View className="flex-row items-center mb-4 ml-1">
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text className="text-green-500 text-sm ml-1">
                    Valid email
                  </Text>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? "#9ca3af" : "#8b5cf6",
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                  marginTop: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Text className="text-white text-lg font-semibold">
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default ForgotPassword;
