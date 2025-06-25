// app/update-child-details.tsx
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
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function UpdateChildDetails() {
  const router = useRouter();
  
  // Form state with existing data
  const [formData, setFormData] = useState({
    firstName: 'Pramodi Peshila',
    birthDate: '05/07/2001',
    guardianPhone: '0711234567',
    emergencyContact: '0777654321',
    address: '123 Main Street, Colombo',
    allergies: 'None',
    medicalConditions: 'None',
    notes: 'Loves drawing and playing with blocks'
  });

  const [profileImage, setProfileImage] = useState(require('../../assets/images/kid1.jpg'));
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    Alert.alert(
      'Success', 
      'Child details updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            setHasUnsavedChanges(false);
            router.back();
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { 
            text: 'Discard Changes', 
            style: 'destructive',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
  };

  const pickImageFromGallery = async () => {
    // TODO: Implement image picker functionality
    Alert.alert('Info', 'Image picker functionality will be available after installing expo-image-picker');
    setShowImagePicker(false);
  };

  const takePhoto = async () => {
    // TODO: Implement camera functionality
    Alert.alert('Info', 'Camera functionality will be available after installing expo-image-picker');
    setShowImagePicker(false);
  };

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    keyboardType = 'default',
    multiline = false,
    numberOfLines = 1 
  }: any) => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-600 mb-2 ml-1">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 16,
          paddingHorizontal: 20,
          paddingVertical: multiline ? 16 : 18,
          fontSize: 16,
          fontWeight: '500',
          color: '#374151',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          textAlignVertical: multiline ? 'top' : 'center'
        }}
      />
    </View>
  );

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
          {/* Header */}
          <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
            <TouchableOpacity 
              onPress={handleCancel}
              className="w-10 h-10 justify-center items-center"
              
            >
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>
            
            <Text className="text-xl font-bold text-gray-700 mt-20">
              Update Child Details
            </Text>
            
            <View className="w-10" />
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Profile Image Section */}
            <View className="items-center mb-8 px-6">
              <TouchableOpacity
                onPress={() => setShowImagePicker(true)}
                className="relative"
              >
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
                    source={profileImage} 
                    className="w-full h-full"
                    style={{ borderRadius: 64, borderWidth: 4, borderColor: '#7c3aed' }}
                  />
                </View>
                
                {/* Camera Icon Overlay */}
                <View 
                  className="absolute bottom-2 right-2 w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#7c3aed' }}
                >
                  <Ionicons name="camera" size={20} color="white" />
                </View>
              </TouchableOpacity>
              
              <Text className="text-sm text-gray-600 mt-3 text-center">
                Tap to change photo
              </Text>
            </View>

            {/* Form Fields */}
            <View className="px-6">
              <InputField
                label="Full Name"
                value={formData.firstName}
                onChangeText={(value: string) => handleInputChange('firstName', value)}
                placeholder="Enter child's full name"
              />

              <InputField
                label="Date of Birth"
                value={formData.birthDate}
                onChangeText={(value: string) => handleInputChange('birthDate', value)}
                placeholder="DD/MM/YYYY"
              />

              <InputField
                label="Guardian's Phone Number"
                value={formData.guardianPhone}
                onChangeText={(value: string) => handleInputChange('guardianPhone', value)}
                placeholder="0XX XXX XXXX"
                keyboardType="phone-pad"
              />

              <InputField
                label="Emergency Contact Number"
                value={formData.emergencyContact}
                onChangeText={(value: string) => handleInputChange('emergencyContact', value)}
                placeholder="0XX XXX XXXX"
                keyboardType="phone-pad"
              />

              <InputField
                label="Home Address"
                value={formData.address}
                onChangeText={(value: string) => handleInputChange('address', value)}
                placeholder="Enter home address"
                multiline={true}
                numberOfLines={3}
              />

              {/* <InputField
                label="Allergies"
                value={formData.allergies}
                onChangeText={(value: string) => handleInputChange('allergies', value)}
                placeholder="List any allergies (or 'None')"
                multiline={true}
                numberOfLines={2}
              />

              <InputField
                label="Medical Conditions"
                value={formData.medicalConditions}
                onChangeText={(value: string) => handleInputChange('medicalConditions', value)}
                placeholder="List any medical conditions (or 'None')"
                multiline={true}
                numberOfLines={2}
              />

              <InputField
                label="Additional Notes"
                value={formData.notes}
                onChangeText={(value: string) => handleInputChange('notes', value)}
                placeholder="Any additional information about the child"
                multiline={true}
                numberOfLines={3}
              /> */}

              {/* Action Buttons */}
              <View className="flex-row justify-between mb-8 mt-4">
                <TouchableOpacity
                  onPress={handleCancel}
                  className="flex-1 mr-2"
                >
                  <View
                    className="rounded-2xl py-4 items-center bg-gray-200"
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
                      Save Changes
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Image Picker Modal */}
        <Modal
          visible={showImagePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowImagePicker(false)}
        >
          <View className="flex-1 justify-end bg-black bg-opacity-50">
            <View 
              className="bg-white rounded-t-3xl p-6"
              style={{ 
                paddingBottom: Platform.OS === 'ios' ? 34 : 24 
              }}
            >
              <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
              
              <Text className="text-xl font-bold text-gray-800 mb-6 text-center">
                Change Profile Photo
              </Text>
              
              <View className="space-y-3">
                <TouchableOpacity
                  onPress={takePhoto}
                  className="flex-row items-center p-4 rounded-2xl bg-purple-50"
                >
                  <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mr-4">
                    <Ionicons name="camera" size={24} color="#7c3aed" />
                  </View>
                  <Text className="text-lg font-medium text-gray-700">
                    Take Photo
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={pickImageFromGallery}
                  className="flex-row items-center p-4 rounded-2xl bg-purple-50"
                >
                  <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mr-4">
                    <Ionicons name="images" size={24} color="#7c3aed" />
                  </View>
                  <Text className="text-lg font-medium text-gray-700">
                    Choose from Gallery
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setShowImagePicker(false)}
                  className="flex-row items-center p-4 rounded-2xl bg-gray-50 mt-2"
                >
                  <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-4">
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </View>
                  <Text className="text-lg font-medium text-gray-600">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}