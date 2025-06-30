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
import { apiRequest, API_CONFIG } from '../../config/api';

interface FormData {
  name: string;
  email: string;
  phone_number: string;
}

export default function AdminAddParent() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone_number: '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleAddParent = async () => {
    // Validate form
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter parent name');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter email address');
      return;
    }

    if (!isValidEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!formData.phone_number.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }

    if (!isValidPhone(formData.phone_number)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.ADD_PARENT, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        Alert.alert(
          'Success!',
          `Parent ${formData.name} has been added successfully. An OTP has been sent to ${formData.email}.`,
          [
            {
              text: 'Add Another Parent',
              onPress: () => {
                setFormData({
                  name: '',
                  email: '',
                  phone_number: '',
                });
              },
            },
            {
              text: 'Done',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Error adding parent:', error);
      
      if (error.message.includes('already exists')) {
        Alert.alert('Error', 'A parent with this email already exists');
      } else {
        Alert.alert('Error', error.message || 'Failed to add parent');
      }
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    return phoneRegex.test(phone);
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#2196F3', '#1976D2', '#0D47A1']}
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
            <View className="flex-1 px-6 py-8">
              {/* Header */}
              <View className="flex-row items-center mb-8">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="mr-4"
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View>
                  <Text className="text-white text-2xl font-bold">
                    Add New Parent
                  </Text>
                  <Text className="text-white/80 text-base">
                    Register a new parent in the system
                  </Text>
                </View>
              </View>

              {/* Form */}
              <View className="bg-white/10 rounded-3xl p-6 mb-6">
                <View className="mb-4">
                  <Text className="text-white text-base font-medium mb-2">
                    Parent Name *
                  </Text>
                  <TextInput
                    className="bg-white/20 text-white text-base px-4 py-4 rounded-2xl border border-white/30"
                    placeholder="Enter parent's full name"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    autoCapitalize="words"
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-white text-base font-medium mb-2">
                    Email Address *
                  </Text>
                  <TextInput
                    className="bg-white/20 text-white text-base px-4 py-4 rounded-2xl border border-white/30"
                    placeholder="Enter email address"
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
                    Phone Number *
                  </Text>
                  <TextInput
                    className="bg-white/20 text-white text-base px-4 py-4 rounded-2xl border border-white/30"
                    placeholder="Enter phone number"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={formData.phone_number}
                    onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
                    keyboardType="phone-pad"
                  />
                </View>

                <TouchableOpacity
                  className={`bg-white py-4 rounded-2xl ${loading ? 'opacity-50' : ''}`}
                  onPress={handleAddParent}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#2196F3" />
                  ) : (
                    <Text className="text-blue-600 text-lg font-bold text-center">
                      Add Parent & Send OTP
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Info Box */}
              <View className="bg-white/10 rounded-2xl p-4">
                <View className="flex-row items-start">
                  <Ionicons 
                    name="information-circle" 
                    size={24} 
                    color="rgba(255,255,255,0.8)"
                    style={{ marginRight: 12, marginTop: 2 }}
                  />
                  <View className="flex-1">
                    <Text className="text-white font-bold mb-2">
                      What happens next?
                    </Text>
                    <Text className="text-white/80 text-sm leading-5">
                      1. Parent information will be saved to the database{'\n'}
                      2. A 6-digit OTP will be automatically generated{'\n'}
                      3. An email with the OTP will be sent to the parent{'\n'}
                      4. Parent can then use the mobile app to complete registration
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
