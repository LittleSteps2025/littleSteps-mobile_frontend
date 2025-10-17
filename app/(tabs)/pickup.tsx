// app/pickup-details.tsx
import { API_BASE_URL } from '@/utility';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { shareAsync } from 'expo-sharing';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface ChildInfo {
  name: string;
  grade: string;
  class: string;
  studentId: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  photo?: string;
}

interface GuardianFormData {
  name: string;
  nic: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  parent_id: string;
}

export default function PickupDetailsPage() {
  const router = useRouter();

  // QR modal state
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [qrTitle, setQrTitle] = useState('Guardian QR');

  const openQrForContact = (contact: EmergencyContact) => {
    // Simple encoded text for the QR. You can change to JSON if needed.
    const value = `Name: ${contact.name}\nRelationship: ${contact.relationship}`;
    setQrValue(value);
    setQrTitle(`${contact.name} - ${contact.relationship}`);
    setQrModalVisible(true);
  };

  // Child information
  const [childInfo] = useState<ChildInfo>({
    name: 'Pathum Silva',
    grade: 'Grade 5',
    class: 'A',
    studentId: 'ST12345'
  });

  const qrRef = useRef<any>(null);

  // Helper: convert QR component to base64 PNG using its toDataURL method
  const getQrDataUrl = () =>
    new Promise<string>((resolve, reject) => {
      try {
        if (qrRef.current && typeof qrRef.current.toDataURL === 'function') {
          qrRef.current.toDataURL((data: string) => {
            if (data) resolve(data);
            else reject(new Error('Failed to generate QR data'));
          });
        } else {
          reject(new Error('QR ref or toDataURL not available'));
        }
      } catch (err) {
        reject(err);
      }
    });

  const handleDownloadQr = async () => {
    try {
      const base64 = await getQrDataUrl(); // base64 string (PNG)

      // Create a temporary file path
      const filename = `qr_${Date.now()}.png`;
      const fileUri = FileSystem.cacheDirectory + filename;

      // Write base64 to file
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });

      // For native platforms, request permission and save to gallery
      if (Platform.OS !== 'web') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Permission to access media library is required to save the QR image.');
          return;
        }

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        try {
          // Try to create an album (if already exists this will throw)
          await MediaLibrary.createAlbumAsync('LittleSteps', asset, false);
        } catch (e) {
          // Album might already exist — ignore
        }

        Alert.alert('Saved', 'QR image saved to your gallery.');
      } else {
        // Web fallback: attempt to trigger a download
        const dataUrl = `data:image/png;base64,${base64}`;
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const link = document.createElement('a');
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          link.href = dataUrl;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          link.download = filename;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          document.body.appendChild(link);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          link.click();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          document.body.removeChild(link);
          Alert.alert('Downloaded', 'QR image downloaded.');
        } catch (err) {
          // As a fallback, open share dialog
          await shareAsync(fileUri);
        }
      }
    } catch (error) {
      console.error('Error saving QR:', error);
      Alert.alert('Error', 'Unable to save QR image.');
    }
  };


  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const PARENT_ID = '3'; // You can change this or make it dynamic

  const [guardianFormData, setGuardianFormData] = useState<GuardianFormData>({
    name: '',
    nic: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    parent_id: PARENT_ID,
  });

  const relationshipOptions = [
    'Mother',
    'Father',
    'Guardian',
    'Grandmother',
    'Grandfather',
    'Aunt',
    'Uncle',
    'Sibling',
    'Family Friend',
    'Other'
  ];

  const handleBack = () => {
    router.back();
  };

  // Fetch guardians on component mount
  const fetchGuardians = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/parent/guardians/guardians/${PARENT_ID}`);

      const result = await response.json();
      
      if (response.ok && result.success && result.guardians) {
        const formattedContacts: EmergencyContact[] = result.guardians.map((guardian: any) => ({
          id: guardian.guardian_id.toString(),
          name: guardian.name,
          relationship: guardian.relationship,
          phoneNumber: guardian.phone,
          photo: guardian.photo || undefined
        }));
        
        setEmergencyContacts(formattedContacts);
      } else {
        console.error('Failed to fetch guardians:', result.message);
        Alert.alert('Error', result.message || 'Failed to load guardians');
      }
    } catch (error) {
      console.error('Error fetching guardians:', error);
      Alert.alert('Error', 'Failed to load guardian details. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load guardians when component mounts
  React.useEffect(() => {
    fetchGuardians();
  }, []);

  const handleGuardianFormChange = (key: keyof GuardianFormData, value: string) => {
    setGuardianFormData({ ...guardianFormData, [key]: value });
  };

  const handleAddContact = async () => {
    // Validation
    if (!guardianFormData.name.trim()) {
      Alert.alert('Error', 'Please enter guardian name');
      return;
    }
    if (!guardianFormData.relationship.trim()) {
      Alert.alert('Error', 'Please select relationship');
      return;
    }
    if (!guardianFormData.phone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }
    if (!guardianFormData.nic.trim()) {
      Alert.alert('Error', 'Please enter NIC');
      return;
    }
    if (!guardianFormData.email.trim()) {
      Alert.alert('Error', 'Please enter email');
      return;
    }
    if (!guardianFormData.address.trim()) {
      Alert.alert('Error', 'Please enter address');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/parent/guardians/guardians`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guardianFormData),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Reset form
        setGuardianFormData({
          name: '',
          nic: '',
          relationship: '',
          phone: '',
          email: '',
          address: '',
          parent_id: PARENT_ID,
        });
        
        setShowAddContactModal(false);
        Alert.alert('Success', 'Guardian added successfully!');
        
        // Refresh the list
        fetchGuardians();
      } else {
        Alert.alert('Error', result.message || 'Failed to add guardian.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network or server issue occurred.');
    }
  };

  const handleRemoveContact = (contactId: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setEmergencyContacts(prev => prev.filter(c => c.id !== contactId));
            // TODO: Add API call to delete from backend
          }
        }
      ]
    );
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    numberOfLines = 1,
    keyboardType = 'default'
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
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
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

  const ContactCard = ({ contact }: { contact: EmergencyContact }) => (
    <View
      className="mb-4 p-5 rounded-2xl"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e5e7eb'
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {contact.photo ? (
            <Image
              source={{ uri: contact.photo }}
              className="w-16 h-16 rounded-full"
              style={{
                borderWidth: 3,
                borderColor: '#e5e7eb'
              }}
            />
          ) : (
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{
                backgroundColor: '#9ca3af',
                borderWidth: 3,
                borderColor: '#d1d5db'
              }}
            >
              <Ionicons name="person" size={32} color="white" />
            </View>
          )}
          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-gray-800 mb-1">
              {contact.name}
            </Text>
            <Text className="text-purple-600 font-semibold mb-2">
              {contact.relationship}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="call-outline" size={14} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-1">
                {contact.phoneNumber}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => setShowContactDetails(contact.id)}
            className="w-8 h-8 items-center justify-center"
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#DFC1FD', '#f3e8ff', '#F5ECFE', '#F5ECFE', '#e9d5ff', '#DFC1FD']}
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
            <View className="px-6 mt-5 pt-4 pb-2 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={handleBack}
                className="w-10 h-10 justify-center items-center"
              >
                <Ionicons name="chevron-back" size={24} color="#374151" />
              </TouchableOpacity>

              <Text className="text-2xl font-bold text-gray-700">
                Pickup Details
              </Text>

              <TouchableOpacity
                onPress={() => setShowAddContactModal(true)}
                className="w-10 h-10 justify-center items-center"
              >
                <Ionicons name="person-add" size={24} color="#7c3aed" />
              </TouchableOpacity>
            </View>

            {/* Child Information Card */}
            <View className="px-6 mt-4">
              <View
                className="mb-6"
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
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                    <Ionicons name="school" size={24} color="#7c3aed" />
                  </View>
                  <View>
                    <Text className="text-xl font-bold text-gray-800">
                      {childInfo.name}
                    </Text>
                    <Text className="text-purple-600 font-semibold">
                      {childInfo.grade} - Class {childInfo.class}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="id-card-outline" size={18} color="#7c3aed" />
                  <Text className="text-gray-600 ml-2">
                    Student ID: {childInfo.studentId}
                  </Text>
                </View>
              </View>

              {/* Emergency Contacts Section */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-xl font-bold text-gray-700">
                    Emergency Contacts ({emergencyContacts.length})
                  </Text>
                  {isLoading && (
                    <ActivityIndicator size="small" color="#7c3aed" />
                  )}
                </View>

                {isLoading ? (
                  <View className="items-center py-12">
                    <ActivityIndicator size="large" color="#7c3aed" />
                    <Text className="text-gray-500 mt-4">Loading guardians...</Text>
                  </View>
                ) : emergencyContacts.length === 0 ? (
                  <View className="items-center py-12">
                    <View 
                      className="w-20 h-20 rounded-full items-center justify-center mb-4"
                      style={{ backgroundColor: '#f3e8ff' }}
                    >
                      <Ionicons name="people-outline" size={48} color="#9ca3af" />
                    </View>
                    <Text className="text-gray-700 font-semibold text-lg">No Guardians Added</Text>
                    <Text className="text-gray-400 text-sm mt-2 text-center px-8">
                      Tap the + icon above to add emergency contacts for your child
                    </Text>
                  </View>
                ) : (
                  emergencyContacts.map((contact) => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Add Guardian Modal */}
        <Modal
          visible={showAddContactModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddContactModal(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View
              className="bg-white rounded-t-3xl p-6"
              style={{
                paddingBottom: Platform.OS === 'ios' ? 34 : 24,
                maxHeight: '90%'
              }}
            >
              <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />

              <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Add Guardian Details
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                <InputField
                  label="Full Name *"
                  value={guardianFormData.name}
                  onChangeText={(value: string) => handleGuardianFormChange('name', value)}
                  placeholder="Enter full name"
                />

                <InputField
                  label="NIC *"
                  value={guardianFormData.nic}
                  onChangeText={(value: string) => handleGuardianFormChange('nic', value)}
                  placeholder="Enter NIC number"
                />

                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-600 mb-2 ml-1">
                    Relationship *
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row"
                  >
                    {relationshipOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => handleGuardianFormChange('relationship', option)}
                        style={{
                          backgroundColor:
                            guardianFormData.relationship === option
                              ? '#7c3aed'
                              : 'rgba(255, 255, 255, 0.9)',
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 20,
                          marginRight: 8,
                          borderWidth: 1,
                          borderColor:
                            guardianFormData.relationship === option
                              ? '#7c3aed'
                              : '#e5e7eb'
                        }}
                      >
                        <Text
                          style={{
                            color:
                              guardianFormData.relationship === option
                                ? 'white'
                                : '#374151',
                            fontWeight: '600'
                          }}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <InputField
                  label="Phone Number *"
                  value={guardianFormData.phone}
                  onChangeText={(value: string) => handleGuardianFormChange('phone', value)}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />

                <InputField
                  label="Email *"
                  value={guardianFormData.email}
                  onChangeText={(value: string) => handleGuardianFormChange('email', value)}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                />

                <InputField
                  label="Address *"
                  value={guardianFormData.address}
                  onChangeText={(value: string) => handleGuardianFormChange('address', value)}
                  placeholder="Enter address"
                  multiline={true}
                  numberOfLines={3}
                />

                <View className="flex-row justify-between mt-4 mb-2">
                  <TouchableOpacity
                    onPress={() => {
                      setShowAddContactModal(false);
                      setGuardianFormData({
                        name: '',
                        nic: '',
                        relationship: '',
                        phone: '',
                        email: '',
                        address: '',
                        parent_id: PARENT_ID,
                      });
                    }}
                    className="flex-1 mr-2 py-4 rounded-2xl bg-gray-200 items-center"
                  >
                    <Text className="text-gray-700 font-semibold text-base">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleAddContact}
                    className="flex-1 ml-2"
                  >
                    <LinearGradient
                      colors={['#7c3aed', '#a855f7']}
                      className="py-4 rounded-2xl items-center"
                      style={{ borderRadius: 16 }}
                    >
                      <Text className="text-white font-semibold text-base">Add Guardian</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Contact Details Modal */}
        <Modal
          visible={showContactDetails !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowContactDetails(null)}
        >
          <View className="flex-1 justify-center items-center bg-black/50 px-6">
            {showContactDetails && (
              <View
                className="bg-white rounded-3xl p-6 w-full max-w-sm"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 10
                }}
              >
                {(() => {
                  const contact = emergencyContacts.find(
                    (c) => c.id === showContactDetails
                  );
                  if (!contact) return null;

                  return (
                    <>
                      <View className="items-center mb-4">
                        <View
                          className="w-20 h-20 rounded-full items-center justify-center mb-3"
                          style={{
                            backgroundColor: '#9ca3af'
                          }}
                        >
                          <Ionicons name="person" size={40} color="white" />
                        </View>
                        <Text className="text-xl font-bold text-gray-800 mb-1">
                          {contact.name}
                        </Text>
                        <Text className="text-purple-600 font-semibold">
                          {contact.relationship}
                        </Text>
                        
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          setShowContactDetails(null);
                          openQrForContact(contact);
                        }}
                        className="py-3 mb-3 rounded-2xl items-center bg-green-100"
                      >
                        <Text className="text-green-700 font-semibold">
                          Open QR Code
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setShowContactDetails(null);
                          handleRemoveContact(contact.id);
                        }}
                        className="py-3 mb-3 rounded-2xl items-center bg-red-100"
                      >
                        <Text className="text-red-700 font-semibold">
                          Remove Contact
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setShowContactDetails(null)}
                        className="py-3 rounded-2xl items-center bg-gray-100"
                      >
                        <Text className="text-gray-700 font-semibold">Close</Text>
                      </TouchableOpacity>
                    </>
                  );
                })()}
              </View>
            )}
          </View>
        </Modal>

        {/* QR Modal */}
        <Modal
          visible={qrModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setQrModalVisible(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/60 px-6">
            <View className="bg-white rounded-2xl p-6 w-full items-center" style={{ maxWidth: 360 }}>
              <Text className="text-lg font-bold text-gray-800 mb-4">{qrTitle}</Text>
              <View style={{ alignItems: 'center', justifyContent: 'center', padding: 8 }}>
                {/* Primary: render native QR component. Fallback: Google Chart QR image URL if the QR lib can't render on web */}
                <QRCode getRef={(c: any) => (qrRef.current = c)} value={qrValue || ' '} size={200} />

                {/* Fallback image (remote) in case QR component fails on web; rendered as an alternative if needed */}
                {/* <Image source={{ uri: `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(qrValue)}` }} style={{ width: 200, height: 200, marginTop: 12 }} /> */}
              </View>

              <View style={{ marginTop: 16, flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={handleDownloadQr}
                  style={{ flex: 1, backgroundColor: '#10b981', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center' }}
                >
                  <Text style={{ color: 'white', fontWeight: '700' }}>Download QR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setQrModalVisible(false)}
                  style={{ flex: 1, backgroundColor: '#7c3aed', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center' }}
                >
                  <Text style={{ color: 'white', fontWeight: '700' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}