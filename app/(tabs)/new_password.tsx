import CustomAlert from '@/components/CustomAlert';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { API_BASE_URL } from '@/utility';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

type FormData = {
  password: string;
  confirmPassword: string;
};

type FormField = keyof FormData;

type FormErrors = {
  [K in FormField]?: string | null;
};

type TouchedFields = {
  [K in FormField]?: boolean;
};

function NewPassword() {
      const { customAlert, showCustomAlert, hideCustomAlert } = useCustomAlert();
      const router = useRouter();
      const { email, resetToken } = useLocalSearchParams();
      const emailString = Array.isArray(email) ? email[0] : email;
      const tokenString = Array.isArray(resetToken) ? resetToken[0] : resetToken;
      
      // Form state
      const [formData, setFormData] = useState<FormData>({
        password: '',
        confirmPassword: ''
      });
      
      // Validation errors
      const [errors, setErrors] = useState<FormErrors>({});
      
      // UI state
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const [touched, setTouched] = useState<TouchedFields>({});

        const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain at least one special character';
    return null;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return null;
  };

  // Real-time validation
  const validateField = (field: FormField, value: string) => {
    let error = null;
    
    switch (field) {

      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, formData.password);
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return error === null;
  };


    // Handle input change
    const handleInputChange = (field: FormField, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      
      // Validate if field has been touched
      if (touched[field]) {
        validateField(field, value);
      }
      
      // Re-validate confirm password if password changes
      if (field === 'password' && touched.confirmPassword && formData.confirmPassword) {
        validateField('confirmPassword', formData.confirmPassword);
      }
    };
  
    // Handle input blur (when user leaves the field)
    const handleBlur = (field: FormField) => {
      setTouched(prev => ({
        ...prev,
        [field]: true
      }));
      validateField(field, formData[field]);
    };
  
    // Validate entire form
    const validateForm = () => {
      const passwordError = validatePassword(formData.password);
      const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
      
      const newErrors: FormErrors = {
        password: passwordError,
        confirmPassword: confirmPasswordError
      };
      
      setErrors(newErrors);
      setTouched({
        password: true,
        confirmPassword: true
      });
      
      return !passwordError && !confirmPasswordError;
    };
  
    // Handle form submission
    const handleCreateAccount = async () => {
      if (!validateForm()) {
        showCustomAlert('error', 'Validation Error', 'Please fix the errors below');
        return;
      }

      if (!emailString || !tokenString) {
        showCustomAlert('error', 'Error', 'Invalid reset session. Please start the reset process again.');
        return;
      }
  
      setIsLoading(true);
      
      try {
        console.log('Setting new password for:', emailString);
        
        // Reset password with database
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailString,
            resetToken: tokenString,
            newPassword: formData.password
          })
        });

        console.log('Reset password response status:', response.status);
        
        const data = await safeJsonParse(response);
        console.log('Reset password response data:', data);
        
        if (response.ok && (data.status === 200 || data.success)) {
          // Success
          showCustomAlert(
            'success', 
            'Password Reset Successful', 
            'Your password has been reset successfully! You can now log in with your new password.',
            false,
            () => router.push('/signin')
          );
        } else {
          throw new Error(data.message || 'Failed to reset password');
        }
      } catch (error: any) {
        console.error('Reset password error:', error);
        
        let errorMessage = 'Failed to reset password. Please try again.';
        
        if (error instanceof Error) {
          if (error.message.includes('HTML instead of JSON')) {
            errorMessage = 'Server configuration error. Please contact support.';
          } else if (error.message.includes('Empty response')) {
            errorMessage = 'No response from server. Please check your internet connection.';
          } else if (error.message.includes('Invalid JSON')) {
            errorMessage = 'Server returned invalid data. Please try again or contact support.';
          } else if (error.message.includes('expired')) {
            errorMessage = 'Reset session has expired. Please start the reset process again.';
          } else if (error.message.includes('invalid')) {
            errorMessage = 'Invalid reset session. Please start the reset process again.';
          } else {
            errorMessage = error.message;
          }
        }
        
        showCustomAlert('error', 'Reset Failed', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Get password strength
    const getPasswordStrength = (password: string) => {
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/(?=.*[a-z])/.test(password)) strength++;
      if (/(?=.*[A-Z])/.test(password)) strength++;
      if (/(?=.*\d)/.test(password)) strength++;
      if (/(?=.*[@$!%*?&])/.test(password)) strength++;
      
      return strength;
    };
  
    const passwordStrength = getPasswordStrength(formData.password);
    const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  
  return (
    <LinearGradient
      colors={['#DFC1FD','#f3e8ff', '#F5ECFE','#F5ECFE','#e9d5ff', '#DFC1FD']}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView className="flex-1 mt-7">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

            {/* Content */}
            <View className="px-5 pt-5">
              <Text className="text-3xl font-bold text-gray-700 mb-2">
                Reset Password
              </Text>
              <Text className="text-base text-gray-500 mb-8">
                Enter your new password below
              </Text>

              {/* Password Input */}
              <Text className="text-base text-gray-700 mb-2 font-medium">
                Password
              </Text>
              <View className="relative mb-1">
                <TextInput
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="Create password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    paddingRight: 50,
                    fontSize: 16,
                    borderWidth: errors.password && touched.password ? 2 : 0,
                    borderColor: errors.password && touched.password ? '#ef4444' : 'transparent',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Password Strength Indicator */}
              {formData.password.length > 0 && (
                <View className="mb-2">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-sm text-gray-600">Password Strength</Text>
                    <Text 
                      className="text-sm font-medium"
                      style={{ color: strengthColors[passwordStrength - 1] || '#ef4444' }}
                    >
                      {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                    </Text>
                  </View>
                  <View className="flex-row space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <View
                        key={level}
                        className="flex-1 h-2 rounded-full"
                        style={{
                          backgroundColor: level <= passwordStrength 
                            ? strengthColors[passwordStrength - 1] || '#ef4444'
                            : '#e5e7eb'
                        }}
                      />
                    ))}
                  </View>
                </View>
              )}
              
              {errors.password && touched.password && (
                <Text className="text-red-500 text-sm mb-4 ml-1">
                  {errors.password}
                </Text>
              )}

              {/* Confirm Password Input */}
              <Text className="text-base text-gray-700 mb-2 font-medium">
                Confirm Password
              </Text>
              <View className="relative mb-1">
                <TextInput
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Confirm your password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    paddingRight: 50,
                    fontSize: 16,
                    borderWidth: errors.confirmPassword && touched.confirmPassword ? 2 : 0,
                    borderColor: errors.confirmPassword && touched.confirmPassword ? '#ef4444' : 'transparent',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              </View>
              
              {errors.confirmPassword && touched.confirmPassword && (
                <Text className="text-red-500 text-sm mb-6 ml-1">
                  {errors.confirmPassword}
                </Text>
              )}
              
              {!errors.confirmPassword && touched.confirmPassword && formData.confirmPassword && (
                <View className="flex-row items-center mb-6 ml-1">
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text className="text-green-500 text-sm ml-1">Passwords match</Text>
                </View>
              )}

              {/* Password Requirements */}
              <View className="mb-8 p-4 bg-white/50 rounded-xl">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Password Requirements:
                </Text>
                {[
                  { rule: 'At least 8 characters', check: formData.password.length >= 8 },
                  { rule: 'One lowercase letter', check: /(?=.*[a-z])/.test(formData.password) },
                  { rule: 'One uppercase letter', check: /(?=.*[A-Z])/.test(formData.password) },
                  { rule: 'One number', check: /(?=.*\d)/.test(formData.password) },
                  { rule: 'One special character', check: /(?=.*[@$!%*?&])/.test(formData.password) }
                ].map((req, index) => (
                  <View key={index} className="flex-row items-center mb-1">
                    <Ionicons 
                      name={req.check ? "checkmark-circle" : "ellipse-outline"} 
                      size={16} 
                      color={req.check ? "#22c55e" : "#9ca3af"} 
                    />
                    <Text 
                      className={`text-sm ml-2 ${req.check ? 'text-green-600' : 'text-gray-500'}`}
                    >
                      {req.rule}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Reset Password Button */}
              <TouchableOpacity
                onPress={handleCreateAccount}
                disabled={isLoading}
                className={`rounded-3xl py-4 items-center mb-8 ${
                  isLoading ? 'bg-purple-400' : 'bg-purple-600'
                }`}
                style={{
                  shadowColor: '#7c3aed',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4
                }}
              >
                <Text className="text-white text-lg font-semibold">
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Text>
              </TouchableOpacity>
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
  )
}

export default NewPassword