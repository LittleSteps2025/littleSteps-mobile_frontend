// app/child-details.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ColorValue } from 'react-native';
import { images } from '@/assets/images/images';

export default function ChildDetailsForm() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleBack = () => {
    router.back(); // This will navigate to the previous screen
  };
  
  // Static data for display
  const childData = {
    firstName: params.Name || 'Pramodi Peshila',
    birthDate: '05/07/2001',
    phoneNumber: '0711234567',
    emergencyNumber: '0777654321',
    homeAddress: '123 Main St, Colombo',
  };

  const navigationItems = [
    {
      title: 'Health Records',
      description: 'Medical history & checkups',
      icon: images.doctor,
      color: ['#6366f1', '#8b5cf6'],
      route: '/health' as const,
    },
    {
      title: 'Pick-Up Details',
      description: 'Who is allowed to pick up',
      icon: images.pickUp,
      color: ['#ec4899', '#f97316'],
      route: '/pickup' as const,
    },
    {
      title: 'Daily Reports',
      description: 'Daily activity summaries',
      icon: images.report,
      color: ['#10b981', '#06b6d4'],
      route: '/' as const,
    },
    {
      title: 'Payment Details',
      description: 'Manage fees & payments',
      icon: images.payment_details,
      color: ['#4E71FF', '#8DD8FF'],
      route: '/payment_interface' as const,
    },
  ] as const;

  return (
    <LinearGradient
      colors={['#DFC1FD','#f3e8ff', '#F5ECFE','#F5ECFE','#e9d5ff', '#DFC1FD']}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#DFC1FD" />
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
         <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
                     <TouchableOpacity 
                       onPress={handleBack}
                       className="w-10 h-10 justify-center items-center"
                       
                     >
                       <Ionicons name="chevron-back" size={24} color="#374151" />
                     </TouchableOpacity>
                     
                     <Text className="text-2xl font-bold text-gray-700 mt-12">
                       View Child Details
                     </Text>
                     
                     <View className="w-10" />
                   </View>
          {/* Profile Image */}
          <View className="items-center mb-8 mt-4">
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

          {/* Child Information Card */}
          <View className="px-6">
            <View
              className="mb-8"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 20,
                padding: 24,
                shadowColor: '#7c3aed',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 8,
                borderWidth: 1,
                borderColor: 'rgba(124, 58, 237, 0.1)'
              }}
            >
              {/* Card Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-gray-800">
                  Child Details
                </Text>
                <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center">
                  <Ionicons name="person" size={18} color="#7c3aed" />
                </View>
              </View>

              {/* Details Grid */}
              <View className="space-y-4">
                {/* Full Name */}
                <View className="flex-row items-center py-3 border-b border-gray-100">
                  <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center mr-4">
                    <Ionicons name="person-outline" size={18} color="#7c3aed" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </Text>
                    <Text className="text-base font-semibold text-gray-800">
                      {childData.firstName}
                    </Text>
                  </View>
                </View>

                {/* Date of Birth */}
                <View className="flex-row items-center py-3 border-b border-gray-100">
                  <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-4">
                    <Ionicons name="calendar-outline" size={18} color="#3b82f6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-500 mb-1">
                      Date of Birth
                    </Text>
                    <Text className="text-base font-semibold text-gray-800">
                      {childData.birthDate}
                    </Text>
                  </View>
                </View>

                {/* Guardian's Phone */}
                <View className="flex-row items-center py-3 border-b border-gray-100">
                  <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center mr-4">
                    <Ionicons name="call-outline" size={18} color="#10b981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-500 mb-1">
                      Guardian's Phone
                    </Text>
                    <Text className="text-base font-semibold text-gray-800">
                      {childData.phoneNumber}
                    </Text>
                  </View>
                </View>

                {/* Emergency Contact */}
                <View className="flex-row items-center py-3 border-b border-gray-100">
                  <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center mr-4">
                    <Ionicons name="medical-outline" size={18} color="#ef4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-500 mb-1">
                      Emergency Contact
                    </Text>
                    <Text className="text-base font-semibold text-gray-800">
                      {childData.emergencyNumber}
                    </Text>
                  </View>
                </View>

                {/* Home Address */}
                <View className="flex-row items-center py-3">
                  <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mr-4">
                    <Ionicons name="home-outline" size={18} color="#f97316" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-500 mb-1">
                      Home Address
                    </Text>
                    <Text className="text-base font-semibold text-gray-800">
                      {childData.homeAddress}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Edit Details Button */}
            <TouchableOpacity
              onPress={() => router.push('/Update_Child_Details')}
              className="mb-8"
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
                <View className="flex-row items-center">
                  <Ionicons name="create" size={20} color="white" />
                  <Text className="text-white text-lg font-semibold ml-2">
                    Edit Details
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Navigation Section */}
            <View className="mb-8">
              <Text className="text-xl font-bold text-gray-700 mb-6">
                Explore More
              </Text>

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
                          <Image source={item.icon} className='w-20 h-20'/>
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
                onPress={() => router.push('/dailyRecords')}
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
      </SafeAreaView>
    </LinearGradient>
  );
}