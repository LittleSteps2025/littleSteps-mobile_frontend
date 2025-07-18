// app/child-details.tsx
import { images } from '@/assets/images/images';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';

import {
  ColorValue,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ChildDetailsForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleBack = () => {
    router.back(); // This will navigate to the previous screen
  };

  const handleImagePress = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Static data for display
  
  const { user } = useUser();

  // Find the specific child from session based on ID in params
  const findChildFromSession = () => {
    // First check if we have an ID in params
    const childId = params.id?.toString();
    
    console.log("=== DETAILED DEBUGGING ===");
    console.log("Looking for child with ID:", childId);
    console.log("Children in session:", user?.children?.length || 0);
    console.log("Full user data:", JSON.stringify(user, null, 2));
    
    // If we have children in session, let's check them
    if (user?.children && user.children.length > 0) {
      console.log("All children in session:");
      user.children.forEach((child, index) => {
        console.log(`Child ${index}:`, {
          id: child.id,
          name: child.name,
          dateOfBirth: child.dateOfBirth,
          emergencyContact: child.emergencyContact
        });
      });
      
      // If we have an ID and it's not empty, try to find the child
      if (childId && childId !== '' && childId !== 'undefined') {
        const foundChild = user.children.find(child => 
          child.id?.toString() === childId
        );
        
        if (foundChild) {
          console.log("✅ Found child by ID:", foundChild.name);
          return {
            firstName: foundChild.name || 'N/A',
            birthDate: foundChild.dateOfBirth ? 
              new Date(foundChild.dateOfBirth).toLocaleDateString() : 'N/A',
            phoneNumber: user?.phone || 'N/A',
            emergencyNumber: foundChild.emergencyContact || 'N/A',
            homeAddress: user?.address || 'N/A',
            profileImage: (foundChild.profileImage && typeof foundChild.profileImage === 'string' && foundChild.profileImage !== 'a' && foundChild.profileImage.startsWith('http')) 
              ? foundChild.profileImage 
              : null
          };
        }
        console.log("❌ Child not found with ID:", childId);
      }
      
      // If no valid ID or child not found by ID, use first child
      console.log("🔄 Using first child in session");
      const firstChild = user.children[0];
      return {
        firstName: firstChild.name || 'N/A',
        birthDate: firstChild.dateOfBirth ? 
          new Date(firstChild.dateOfBirth).toLocaleDateString() : 'N/A',
        phoneNumber: user?.phone || 'N/A',
        emergencyNumber: firstChild.emergencyContact || user?.phone || 'N/A',
        homeAddress: user?.address || 'N/A',
        profileImage: (firstChild.profileImage && typeof firstChild.profileImage === 'string' && firstChild.profileImage !== 'a' && firstChild.profileImage.startsWith('http')) 
          ? firstChild.profileImage 
          : null
      };
    }
    
    // If no child found with ID, use params directly
    if (params && Object.keys(params).length > 0) {
      console.log("📄 Using child data from params");
      return {
        firstName: params.name || params.firstName || 'N/A',
        birthDate: params.birthDate || params.dob || 'N/A',
        phoneNumber: params.phoneNumber || 'N/A',
        emergencyNumber: params.emergencyNumber || 'N/A',
        homeAddress: params.homeAddress || 'N/A',
        profileImage: undefined 
      };
    }
    
    // No data available
    console.log("❌ No child data available - using defaults");
    return {
      firstName: 'No Child Data',
      birthDate: 'Not available',
      phoneNumber: 'Not available',
      emergencyNumber: 'Not available',
      homeAddress: 'Not available',
      profileImage: undefined
    };
  };
  
  // Get child details from session
  const childData = findChildFromSession();

  const navigationItems = [

    {
      title: 'Update Daily Activities',
      description: 'Manage daily activities',
      icon: images.daily_activities,
      color: ['#fc2b00','#ff5733', '#f9a796'],
      route: '/dailyRecords' as const,
    },
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
      route: '/viewReport' as const,
    },
    {
      title: 'Payment Details',
      description: 'Manage fees & payments',
      icon: images.payment_details,
      color: ['#4E71FF', '#8DD8FF'],
      route: '/payment_interface' as const,
    },
  ] as const;

  // Debug: Log session data for child details
  React.useEffect(() => {
    if (user) {
      console.log("🔍 CHILD DETAILS SESSION DATA:");
      console.log("User ID:", user.id);
      console.log("User Name:", user.fullName);
      console.log("Children in session:", user.children?.length || 0);
      console.log("Current params:", params);
      console.log("Selected child data:", childData);
    }
  }, [user, params, childData]);

  return (
    <LinearGradient
      colors={['#DFC1FD', '#f3e8ff', '#F5ECFE', '#F5ECFE', '#e9d5ff', '#DFC1FD']}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1 "
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

            {/* <Text className="text-2xl font-bold text-gray-700 mt-12">
              View Child Details
            </Text> */}

            <View className="w-10" />
          </View>
          {/* Profile Image */}
          <View className="items-center mb-8 mt-4">
            <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
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
                    source={childData.profileImage ? 
                      { uri: childData.profileImage } : 
                      images.Kid1
                    }
                    className="w-full h-full"
                    style={{ borderRadius: 64, borderWidth: 4, borderColor: '#7c3aed' }}
                  />
                </View>
                {/* Info Icon */}
                <View 
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full items-center justify-center"
                  style={{
                    shadowColor: '#7c3aed',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <Ionicons name="information" size={16} color="white" />
                </View>
              </View>
            </TouchableOpacity>
            <Text className="text-gray-600 text-sm mt-2 opacity-70">
              Tap to view details
            </Text>
          </View>

          {/* Child Information Card */}
          <View className="px-6">
            
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
                          <Image source={item.icon} className='w-20 h-20' />
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
 
            </View>
          </View>

        </ScrollView>

        {/* Child Information Modal */}
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View 
            className="flex-1 justify-center items-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <TouchableOpacity 
              className="absolute inset-0"
              onPress={closeModal}
              activeOpacity={1}
            />
            
            <View 
              className="mx-6 max-w-sm w-full"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 24,
                padding: 24,
                shadowColor: '#7c3aed',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 16,
                elevation: 12,
                borderWidth: 1,
                borderColor: 'rgba(124, 58, 237, 0.1)'
              }}
            >
              {/* Modal Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-gray-800">
                  Child Details
                </Text>
                <TouchableOpacity 
                  onPress={closeModal}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="close" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Child Image */}
              <View className="items-center mb-6">
                <View
                  className="w-20 h-20 rounded-full overflow-hidden"
                  style={{
                    shadowColor: '#7c3aed',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <Image
                    source={childData.profileImage ? 
                      { uri: childData.profileImage } : 
                      images.Kid1
                    }
                    className="w-full h-full"
                    style={{ borderRadius: 40, borderWidth: 2, borderColor: '#7c3aed' }}
                  />
                </View>
              </View>

              {/* Details */}
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
                      Guardian&apos;s Phone
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

              {/* Edit Button */}
              <TouchableOpacity
                onPress={() => {
                  closeModal();
                  router.push('/Update_Child_Details');
                }}
                className="mt-6"
              >
                <LinearGradient
                  colors={['#7c3aed', '#a855f7']}
                  start={[0, 0]}
                  end={[1, 1]}
                  className="rounded-2xl py-3 items-center"
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
                    <Ionicons name="create" size={16} color="white" />
                    <Text className="text-white text-base font-semibold ml-2">
                      Edit Details
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}