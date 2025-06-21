
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
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <LinearGradient
      colors={['#DFC1FD','#f3e8ff', '#F5ECFE','#F5ECFE','#e9d5ff', '#DFC1FD']}
      start={[0, 0]} 
      end={[1, 1]}  
      className="flex-1"
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
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
        <View className="flex-1 px-5 pt-5 mt-10">
          <Text className="text-3xl font-bold text-gray-700 mb-2">
            Create an account
          </Text>
          <Text className="text-base text-gray-500 mb-10">
            Excited to have you on board!
          </Text>

          {/* Email */}
          <Text className="text-base text-gray-700 mb-2 font-medium">
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            className="bg-white rounded-xl px-4 py-4 text-base mb-6"
          />

          {/* Password */}
          <Text className="text-base text-gray-700 mb-2 font-medium">
            Password
          </Text>
          <View className="relative mb-10">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create password"
              secureTextEntry={!showPassword}
              className="bg-white rounded-xl px-4 py-4 pr-12 text-base"
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

          {/* Button */}
          <TouchableOpacity className="bg-purple-600 rounded-3xl py-4 items-center">
            <Text className="text-white text-lg font-semibold">
              Create an account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Link */}
        <View className="px-5 pb-8 items-center">
          <View className="flex-row items-center">
            <Text className="text-base text-gray-500">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-base text-purple-600 font-semibold">
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}