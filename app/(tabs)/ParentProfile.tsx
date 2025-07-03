import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ParentProfile() {
  const router = useRouter();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phoneNumber: '+94 77 123 4567',
    address: '45 Flower Road, Colombo 07, Sri Lanka'
  });

  const handleBack = () => {
    router.back();
  };

  const openEditModal = () => {
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
  };

  const handleSaveProfile = () => {
    // Here you would typically save to backend
    Alert.alert('Success', 'Profile updated successfully!');
    closeEditModal();
  };

  const handleInputChange = (field: keyof typeof editForm, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Image picker functions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to change your profile photo.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Select Photo',
      'Choose how you would like to select a photo',
      [
        {
          text: 'Camera',
          onPress: openCamera,
        },
        {
          text: 'Photo Library',
          onPress: openImageLibrary,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take a photo.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Static parent data - replace with actual data from your backend/state
  const parentData = {
    name: editForm.name,
    email: editForm.email,
    phoneNumber: editForm.phoneNumber,
    address: editForm.address,
    profileImage: profileImage ? { uri: profileImage } : require('@/assets/images/kid1.jpg'), // Use selected image or default
    joinDate: 'January 2024',
    children: ['Pramodi Peshila', 'Alex Johnson'] // List of children
  };

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        {
          label: 'Full Name',
          value: parentData.name,
          icon: 'person-outline',
          color: '#7c3aed'
        },
        {
          label: 'Email Address',
          value: parentData.email,
          icon: 'mail-outline',
          color: '#3b82f6'
        },
        {
          label: 'Phone Number',
          value: parentData.phoneNumber,
          icon: 'call-outline',
          color: '#10b981'
        },
        {
          label: 'Home Address',
          value: parentData.address,
          icon: 'location-outline',
          color: '#f59e0b'
        }
      ]
    },
    {
      title: 'Account Information',
      items: [
        {
          label: 'Member Since',
          value: parentData.joinDate,
          icon: 'calendar-outline',
          color: '#ef4444'
        },
        {
          label: 'Children Enrolled',
          value: parentData.children.join(', '),
          icon: 'people-outline',
          color: '#8b5cf6'
        }
      ]
    }
  ];

  

  return (
    <LinearGradient
      colors={['#DFC1FD', '#f3e8ff', '#F5ECFE', '#F5ECFE', '#e9d5ff', '#DFC1FD']}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1 pt-5"
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
            
            <Text className="text-xl font-bold text-gray-700">
              Parent Profile
            </Text>

            <TouchableOpacity
              onPress={openEditModal}
              className="w-10 h-10 justify-center items-center"
            >
              <Ionicons name="create-outline" size={24} color="#7c3aed" />
            </TouchableOpacity>
          </View>

          {/* Profile Image and Basic Info */}
          <View className="items-center mb-8 mt-4">
            <TouchableOpacity onPress={openEditModal} activeOpacity={0.8}>
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
                    source={parentData.profileImage}
                    className="w-full h-full"
                    style={{ borderRadius: 64, borderWidth: 4, borderColor: '#7c3aed' }}
                  />
                </View>
                {/* Edit Icon */}
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
                  <Ionicons name="create" size={16} color="white" />
                </View>
              </View>
            </TouchableOpacity>
            
            <Text className="text-2xl font-bold text-gray-800 mt-4">
              {parentData.name}
            </Text>
            <Text className="text-gray-600 text-base mt-1">
              Parent • Member since {parentData.joinDate}
            </Text>
            <Text className="text-gray-500 text-sm mt-1 opacity-70">
              Tap image to edit profile
            </Text>
          </View>

          {/* Profile Information Sections */}
          <View className="px-6">
            {profileSections.map((section, sectionIndex) => (
              <View key={sectionIndex} className="mb-8">
                <Text className="text-lg font-bold text-gray-700 mb-4">
                  {section.title}
                </Text>
                
                <View
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    shadowColor: '#7c3aed',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  {section.items.map((item, itemIndex) => (
                    <View 
                      key={itemIndex} 
                      className={`flex-row items-center py-4 ${
                        itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <View 
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <Ionicons name={item.icon as any} size={20} color={item.color} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-gray-500 mb-1">
                          {item.label}
                        </Text>
                        <Text className="text-base font-semibold text-gray-800">
                          {item.value}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* Quick Actions */}
            {/* <View className="mb-8">
              <Text className="text-lg font-bold text-gray-700 mb-4">
                More Options
              </Text>

              <TouchableOpacity
                onPress={() => router.push('/ParentDashboard')}
                activeOpacity={0.8}
                className="mb-4"
              >
                <LinearGradient
                  colors={['#7c3aed', '#a855f7']}
                  start={[0, 0]}
                  end={[1, 1]}
                  className="rounded-2xl p-5"
                  style={{
                    shadowColor: '#7c3aed',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 6
                  }}
                >
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-full bg-white bg-opacity-20 items-center justify-center mr-4">
                      <Ionicons name="grid-outline" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-lg font-bold mb-1">
                        Parent Dashboard
                      </Text>
                      <Text className="text-white text-sm opacity-90">
                        Access all parent features and tools
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View> */}

            
          </View>
        </ScrollView>

        {/* Edit Profile Modal */}
        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeEditModal}
        >
          <View 
            className="flex-1 justify-end"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <TouchableOpacity 
              className="flex-1"
              onPress={closeEditModal}
              activeOpacity={1}
            />
            
            <View 
              className="rounded-t-3xl p-6"
              style={{
                backgroundColor: 'white',
                maxHeight: '85%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.25,
                shadowRadius: 16,
                elevation: 16
              }}
            >
              {/* Modal Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-gray-800">
                  Edit Profile
                </Text>
                <TouchableOpacity 
                  onPress={closeEditModal}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="close" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Profile Image */}
              <View className="items-center mb-6">
                <View className="relative">
                  <View
                    className="w-24 h-24 rounded-full overflow-hidden"
                    style={{
                      shadowColor: '#7c3aed',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 4,
                    }}
                  >
                    <Image
                      source={parentData.profileImage}
                      className="w-full h-full"
                      style={{ borderRadius: 48, borderWidth: 3, borderColor: '#7c3aed' }}
                    />
                  </View>
                  <TouchableOpacity 
                    onPress={pickImage}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 rounded-full items-center justify-center"
                    style={{
                      shadowColor: '#7c3aed',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4,
                    }}
                  >
                    <Ionicons name="camera" size={14} color="white" />
                  </TouchableOpacity>
                </View>
                <Text className="text-sm text-gray-500 mt-2">Tap to change photo</Text>
              </View>

              {/* Edit Form */}
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Full Name */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </Text>
                  <TextInput
                    value={editForm.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    style={{
                      fontSize: 16,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1
                    }}
                  />
                </View>

                {/* Email */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </Text>
                  <TextInput
                    value={editForm.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    style={{
                      fontSize: 16,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1
                    }}
                  />
                </View>

                {/* Phone Number */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </Text>
                  <TextInput
                    value={editForm.phoneNumber}
                    onChangeText={(value) => handleInputChange('phoneNumber', value)}
                    keyboardType="phone-pad"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    style={{
                      fontSize: 16,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1
                    }}
                  />
                </View>

                {/* Address */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Home Address
                  </Text>
                  <TextInput
                    value={editForm.address}
                    onChangeText={(value) => handleInputChange('address', value)}
                    multiline
                    numberOfLines={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    style={{
                      fontSize: 16,
                      height: 80,
                      textAlignVertical: 'top',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1
                    }}
                  />
                </View>

                {/* Action Buttons */}
                <View className="flex-row space-x-3 mb-4">
                  <TouchableOpacity
                    onPress={closeEditModal}
                    className="flex-1 py-3 rounded-xl border border-gray-300 mr-2"
                    style={{
                      backgroundColor: '#f9fafb'
                    }}
                  >
                    <Text className="text-center text-gray-700 font-semibold text-base">
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSaveProfile}
                    className="flex-1 py-3 rounded-xl"
                    style={{
                      backgroundColor: '#7c3aed',
                      shadowColor: '#7c3aed',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4
                    }}
                  >
                    <Text className="text-center text-white font-semibold text-base">
                      Save Changes
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}
