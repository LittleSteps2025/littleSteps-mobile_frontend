// app/child-details.tsx
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
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ColorValue } from 'react-native';

export default function ChildDetailsForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: params.Name || 'Pramodi Peshila',
    birthDate: '05/07/2001',
    phoneNumber: '0711234567',
    emergencyNumber: '0777654321'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    Alert.alert('Success', 'Child details updated successfully!');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const navigationItems = [
    // {
    //   title: 'Development Progress',
    //   description: 'Track milestones & growth',
    //   icon: 'trending-up',
    //   color: ['#6366f1', '#8b5cf6'],
    //   route: '/progress'
    // },
    {
      title: 'Health Records',
      description: 'Medical history & checkups',
      icon: 'medkit',
      color: ['#6366f1', '#8b5cf6'],
      route: '/health' as const,
    },
    {

      title: 'Pick-Up Details',
      description: 'Who is allowed to pick up',
      icon: 'car-sport',
      color: ['#ec4899', '#f97316'],
      route: '/pickup' as const,
    },
    {
      title: 'Daily Reports',
      description: 'Daily activity summaries',
      icon: 'document-text',
      color: ['#10b981', '#06b6d4'],
      route: '/reports' as const,
    },
  ]as const;

  return (
    <LinearGradient
      colors={['#DFC1FD','#f3e8ff', '#F5ECFE','#F5ECFE','#e9d5ff', '#DFC1FD']}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#DFC1FD" />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="px-6 pt-4 pb-6">
              <TouchableOpacity 
                onPress={() => router.back()}
                className="w-10 h-10 justify-center items-center mb-4"
              >
                <Ionicons name="chevron-back" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Profile Image */}
            <View className="items-center mb-8">
              <View className="relative">
                <View
                  className="w-32 h-32 rounded-full overflow-hidden"
                  style={{
                    shadowColor: '#7c3aed',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Image 
                    source={require('../../assets/images/kid1.jpg')} 
                    className="w-full h-full"
                    style={{ borderRadius: 64 , borderWidth: 4, borderColor: '#7c3aed' }}
                  />
                </View>
              </View>
            </View>

            {/* Form Fields */}
            <View className="px-6">
              {/* First Name Field */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-600 mb-2 ml-1">
                  Full Name
                </Text>
                <TextInput
                  value={"Pramodi Peshila"}
                  onChangeText={(value) => handleInputChange('Name', value)}
                  editable={isEditing}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.86)',
                    borderRadius: 16,
                    paddingHorizontal: 20,
                    paddingVertical: 18,
                    fontSize: 16,
                    fontWeight: '500',
                    color: '#374151',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2
                  }}
                />
              </View>

              {/* Birth Date Field */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-600 mb-2 ml-1">
                  Date of birth
                </Text>
                <View className="flex-row items-center">
                  <TextInput
                    value={formData.birthDate}
                    onChangeText={(value) => handleInputChange('birthDate', value)}
                    placeholder="05/07/1989"
                    placeholderTextColor="#9ca3af"
                    editable={isEditing}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: 16,
                      paddingHorizontal: 20,
                      paddingVertical: 18,
                      fontSize: 16,
                      fontWeight: '500',
                      color: '#374151',
                      flex: 1,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2
                    }}
                  />
                </View>
              </View>

              {/* Phone Number Field */}
              <View className="mb-8">
                <Text className="text-sm font-medium text-gray-600 mb-2 ml-1">
                  Guardian's Phone number
                </Text>
                <View className="flex-row items-center">
                  <TextInput
                    value={formData.phoneNumber}
                    onChangeText={(value) => handleInputChange('phoneNumber', value)}
                    placeholder="000 000 0000"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                    editable={isEditing}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: 16,
                      paddingHorizontal: 20,
                      paddingVertical: 18,
                      fontSize: 16,
                      fontWeight: '500',
                      color: '#374151',
                      flex: 1,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2
                    }}
                  />
                </View>
              </View>
                          
              <View className="mb-8">
                <Text className="text-sm font-medium text-gray-600 mb-2 ml-1">
                  Emergency Contact number
                </Text>
                <View className="flex-row items-center">
                  <TextInput
                    value={formData.phoneNumber}
                    onChangeText={(value) => handleInputChange('phoneNumber', value)}
                    placeholder="000 000 0000"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                    editable={isEditing}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: 16,
                      paddingHorizontal: 20,
                      paddingVertical: 18,
                      fontSize: 16,
                      fontWeight: '500',
                      color: '#374151',
                      flex: 1,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2
                    }}
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-between mb-8">
                {!isEditing ? (
                  <TouchableOpacity
                    onPress={handleEdit}
                    className="flex-1 mr-2"
                  >
                    <LinearGradient
                      colors={['#7c3aed', '#a855f7']}
                      start={[0, 0]}
                      end={[1, 1]}
                      className="rounded-2xl py-4 items-center"
                      style={{
                        shadowColor: '#7c3aed',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                        borderRadius: 16
                      }}
                    >
                      <Text className="text-white text-lg font-semibold">
                        Edit Details
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => setIsEditing(false)}
                      className="flex-1 mr-2"
                    >
                      <View
                        className="rounded-2xl py-4 items-center bg-gray-300"
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 2
                        }}
                      >
                        <Text className="text-gray-700 text-lg font-semibold">
                          Cancel
                        </Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={handleSave}
                      className="flex-1 ml-2"
                    >
                      <LinearGradient
                        colors={['#7c3aed', '#a855f7']}
                        start={[0, 0]}
                        end={[1, 1]}
                        className="rounded-2xl py-4 items-center"
                        style={{
                          shadowColor: '#7c3aed',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 4
                        }}
                      >
                        <Text className="text-white text-lg font-semibold">
                          Save
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* Navigation Section */}
              <View className="mb-8">
                <Text className="text-xl font-bold text-gray-700 mb-6">
                  Explore More
                </Text>
                
                {/* Quick Stats Cards */}
                {/* <View className="flex-row justify-between mb-6">
                  <View
                    className="flex-1 mr-2 p-4 rounded-2xl items-center"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      shadowColor: '#7c3aed',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 6,
                      elevation: 3
                    }}
                  >
                    <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mb-2">
                      <Ionicons name="trophy" size={24} color="#7c3aed" />
                    </View>
                    <Text className="text-2xl font-bold text-purple-600">12</Text>
                    <Text className="text-sm text-gray-600 text-center">Milestones Achieved</Text>
                  </View>
                  
                  <View
                    className="flex-1 ml-2 p-4 rounded-2xl items-center"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      shadowColor: '#7c3aed',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 6,
                      elevation: 3
                    }}
                  > */}
                    {/* <View className="w-12 h-12 rounded-full bg-pink-100 items-center justify-center mb-2">
                      <Ionicons name="heart" size={24} color="#ec4899" />
                    </View>
                    <Text className="text-2xl font-bold text-pink-600">95%</Text>
                    <Text className="text-sm text-gray-600 text-center">Overall Progress</Text>
                  </View>
                </View> */}

                {/* Navigation Cards */}
                <View className="space-y-4">
                  {navigationItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                     onPress={() => router.push(item.route)}

                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={[...item.color] as [ColorValue, ColorValue]}
                        start={[0, 0]}
                        end={[1, 1]}
                        className="rounded-2xl p-5 mb-4"
                        style={{
                          shadowColor: item.color[0],
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.25,
                          shadowRadius: 8,
                          elevation: 6
                        }}
                      >
                        <View className="flex-row items-center">
                          <View className="w-14 h-14 rounded-full bg-white bg-opacity-20 items-center justify-center mr-4">
                            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={28} color="white" />

                          </View>
                          <View className="flex-1">
                            <Text className="text-white text-lg font-bold mb-1">
                              {item.title}
                            </Text>
                            <Text className="text-white text-sm opacity-90">
                              {item.description}
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={24} color="white" />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Additional Quick Action Button */}
                <TouchableOpacity
                  onPress={() => router.push('/dashboard')}
                  className="mt-4"
                >
                  <View
                    className="rounded-2xl py-4 items-center"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderWidth: 2,
                      borderColor: '#7c3aed',
                      borderStyle: 'dashed',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2
                    }}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="apps" size={24} color="#7c3aed" className="mr-2" />
                      <Text className="text-purple-600 text-lg font-semibold ml-2">
                        Update Daily Activities
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}