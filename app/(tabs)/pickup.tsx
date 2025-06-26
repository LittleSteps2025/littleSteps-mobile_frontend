// app/pickup-details.tsx
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
  Alert,
  Modal,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  photo?: string;
  // isPrimary: boolean;
  // isAuthorized: boolean;
  // notes?: string;
}

interface ChildInfo {
  name: string;
  grade: string;
  class: string;
  studentId: string;
}

export default function PickupDetailsPage() {
  const router = useRouter();
  
  // Child information
  const [childInfo] = useState<ChildInfo>({
    name: 'Pramodi Peshila',
    grade: 'Grade 5', // Fixed: uncommented this line
    class: 'A',
    studentId: 'ST12345'
  });

  // Emergency contacts data
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Mother',
      phoneNumber: '+94 77 123 4567',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b332c2bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
      // isPrimary: true,
      // isAuthorized: true,
      // notes: 'Primary contact - Always available during school hours'
    },
    {
      id: '2',
      name: 'Michael Johnson',
      relationship: 'Father',
      phoneNumber: '+94 71 987 6543',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      // isPrimary: false,
      // isAuthorized: true,
      // notes: 'Usually available after 4 PM'
    },
    {
      id: '3',
      name: 'Mary Johnson',
      relationship: 'Grandmother',
      phoneNumber: '+94 11 234 5678',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=388&q=80',
      // isPrimary: false,
      // isAuthorized: true,
      // notes: 'Emergency backup contact'
    },
    {
      id: '4',
      name: 'Lisa Chen',
      relationship: 'Family Friend',
      phoneNumber: '+94 76 555 1234',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      // isPrimary: false,
      // isAuthorized: true,
      // notes: 'Authorized for emergency pickup only'
    }
  ]);

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState<string | null>(null);
  const [newContact, setNewContact] = useState<Omit<EmergencyContact, 'id'>>({
    name: '',
    relationship: '',
    phoneNumber: '',
    photo: '',
    // isPrimary: false,
    // isAuthorized: true,
    // notes: ''
  });

  const relationshipOptions = [
    'Mother', 'Father', 'Guardian', 'Grandmother', 'Grandfather', 
    'Aunt', 'Uncle', 'Sibling', 'Family Friend', 'Nanny', 'Other'
  ];

  const handleBack = () => {
    router.back();
  };

  const handleCallContact = (phoneNumber: string, name: string) => {
    Alert.alert(
      'Call Contact',
      `Would you like to call ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log(`Calling ${phoneNumber}`) }
      ]
    );
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.relationship || !newContact.phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact
    };

    setEmergencyContacts(prev => [...prev, contact]);
    setNewContact({
      name: '',
      relationship: '',
      phoneNumber: '',
      photo: '',
      // isPrimary: false,
      // isAuthorized: true,
      // notes: ''
    });
    setShowAddContactModal(false);
    Alert.alert('Success', 'Emergency contact added successfully!');
  };

  const handleRemoveContact = (contactId: string) => {
    // const contact = emergencyContacts.find(c => c.id === contactId);
    // if (contact?.isPrimary) {
    //   Alert.alert('Cannot Remove', 'Primary contact cannot be removed');
    //   return;
    // }

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
          }
        }
      ]
    );
  };

  // const toggleAuthorization = (contactId: string) => {
  //   const contact = emergencyContacts.find(c => c.id === contactId);
  //   if (contact?.isPrimary) {
  //     Alert.alert('Cannot Change', 'Primary contact authorization cannot be changed');
  //     return;
  //   }

  //   setEmergencyContacts(prev =>
  //     prev.map(contact =>
  //       contact.id === contactId
  //         ? { ...contact, isAuthorized: !contact.isAuthorized }
  //         : contact
  //     )
  //   );
  // };

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
        shadowColor: '#000', // Fixed: removed conditional logic
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, // Fixed: removed conditional logic
        shadowRadius: 8,
        elevation: 3, // Fixed: removed conditional logic
        borderWidth: 1, // Fixed: removed conditional logic
        borderColor: '#e5e7eb' // Fixed: removed conditional logic
      }}
    >
      {/* <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          {contact.isPrimary && (
            <View className="bg-purple-100 px-3 py-1 rounded-full mr-3">
              <Text className="text-purple-700 text-xs font-semibold">PRIMARY</Text>
            </View>
          )}
          <View className={`px-3 py-1 rounded-full ${contact.isAuthorized ? 'bg-green-100' : 'bg-red-100'}`}>
            <Text className={`text-xs font-semibold ${contact.isAuthorized ? 'text-green-700' : 'text-red-700'}`}>
              {contact.isAuthorized ? 'AUTHORIZED' : 'NOT AUTHORIZED'}
            </Text>
          </View>
        </View> */}
      <View className="flex-row items-center justify-between mb-4">
        <View />
        <TouchableOpacity
          onPress={() => setShowContactDetails(contact.id)}
          className="w-8 h-8 items-center justify-center"
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center">
        <View className="mr-4">
          {contact.photo ? (
            <Image
              source={{ uri: contact.photo }}
              className="w-16 h-16 rounded-full"
              style={{
                borderWidth: 3,
                borderColor: '#e5e7eb' // Fixed: removed conditional logic
              }}
            />
          ) : (
            <View 
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{
                backgroundColor: '#9ca3af', // Fixed: removed conditional logic
                borderWidth: 3,
                borderColor: '#d1d5db' // Fixed: removed conditional logic
              }}
            >
              <Ionicons name="person" size={32} color="white" />
            </View>
          )}
        </View>
        
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800 mb-1">
            {contact.name}
          </Text>
          <Text className="text-purple-600 font-semibold mb-2">
            {contact.relationship}
          </Text>
          <TouchableOpacity
            onPress={() => handleCallContact(contact.phoneNumber, contact.name)}
            className="flex-row items-center"
          >
            <Ionicons name="call" size={16} color="#10b981" />
            <Text className="text-green-600 font-medium ml-2">
              {contact.phoneNumber}
            </Text>
          </TouchableOpacity>
          {/* {contact.notes && (
            <Text className="text-gray-500 text-sm mt-2" numberOfLines={2}>
              {contact.notes}
            </Text>
          )} */}
        </View>
      </View>
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
                Pickup Details
              </Text>
              
              <TouchableOpacity 
                onPress={() => setShowAddContactModal(true)}
                className="w-10 h-10 justify-center items-center mt-12"
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
                      Class {childInfo.class}
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
                  {/* <Text className="text-sm text-gray-500">
                    {emergencyContacts.filter(c => c.isAuthorized).length} Authorized
                  </Text> */}
                </View>

                {emergencyContacts.map((contact) => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
              </View>

              {/* Quick Actions Section */}
              <View className="mb-8">
                {/* <Text className="text-lg font-bold text-gray-700 mb-4">
                  Quick Actions
                </Text>
                
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    className="flex-1 mr-2" */}
                    {/* // onPress={() => { */}
                    {/* //   const primaryContact = emergencyContacts.find(c => c.isPrimary);
                    //   if (primaryContact) { */}
                    {/* //     handleCallContact(primaryContact.phoneNumber, primaryContact.name);
                    //   }
                    // }}
                  > */}
                    {/* <LinearGradient
                      colors={['#10b981', '#059669']}
                      className="py-4 rounded-2xl items-center"
                      style={{ borderRadius: 16 }}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="call" size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">
                          Call Primary
                        </Text>
                      </View>
                    </LinearGradient> */}
                  {/* </TouchableOpacity> */}

                  {/* <TouchableOpacity
                    className="flex-1 ml-2" */}
                     {/* onPress={() => Alert.alert('Emergency', 'Emergency alert sent to all contacts')}
                  > */}
                    {/* <LinearGradient
                      colors={['#ef4444', '#dc2626']}
                      className="py-4 rounded-2xl items-center"
                      style={{ borderRadius: 16 }}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="warning" size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">
                          Emergency
                        </Text>
                      </View>
                    </LinearGradient> */}
                    {/* </TouchableOpacity>
                  </View> */}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        
        {/* Add Contact Modal */}
        <Modal
          visible={showAddContactModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddContactModal(false)}
        >
          <View className="flex-1 justify-end bg-black bg-opacity-50">
            <View 
              className="bg-white rounded-t-3xl p-6"
              style={{ 
                paddingBottom: Platform.OS === 'ios' ? 34 : 24,
                maxHeight: '85%'
              }}
            >
              <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
              
              <Text className="text-xl font-bold text-gray-800 mb-6 text-center">
                Add Emergency Contact
              </Text>
              
              <ScrollView showsVerticalScrollIndicator={false}>
                <InputField
                  label="Full Name *"
                  value={newContact.name}
                  onChangeText={(value: string) => setNewContact(prev => ({ ...prev, name: value }))}
                  placeholder="Enter full name"
                />

                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-600 mb-2 ml-1">
                    Relationship *
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                    <View className="flex-row">
                      {relationshipOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => setNewContact(prev => ({ ...prev, relationship: option }))}
                          className={`mr-2 px-4 py-2 rounded-full ${
                            newContact.relationship === option
                              ? 'bg-purple-500'
                              : 'bg-gray-200'
                          }`}
                        >
                          <Text className={`font-medium ${
                            newContact.relationship === option
                              ? 'text-white'
                              : 'text-gray-700'
                          }`}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <InputField
                  label="Phone Number *"
                  value={newContact.phoneNumber}
                  onChangeText={(value: string) => setNewContact(prev => ({ ...prev, phoneNumber: value }))}
                  placeholder="+94 77 123 4567"
                  keyboardType="phone-pad"
                />

                <InputField
                  label="Photo URL (Optional)"
                  value={newContact.photo}
                  onChangeText={(value: string) => setNewContact(prev => ({ ...prev, photo: value }))}
                  placeholder="https://example.com/photo.jpg"
                />

                {/* Fixed: Removed InputField for notes since it's not in the interface */}
                {/* <InputField
                  label="Notes (Optional)"
                  value={newContact.notes}
                  onChangeText={(value: string) => setNewContact(prev => ({ ...prev, notes: value }))}
                  placeholder="Additional information..."
                  multiline={true}
                  numberOfLines={3}
                /> */}

                {/* Fixed: Removed authorization toggle since it's not in the interface */}
                {/* <View className="flex-row items-center justify-between mb-6 p-4 bg-gray-50 rounded-2xl">
                  <Text className="text-gray-700 font-medium">
                    Authorize for pickup
                  </Text>
                  <TouchableOpacity
                    onPress={() => setNewContact(prev => ({ ...prev, isAuthorized: !prev.isAuthorized }))}
                    className={`w-12 h-6 rounded-full ${
                      newContact.isAuthorized ? 'bg-green-500' : 'bg-gray-300'
                    } items-center justify-center`}
                  >
                    <View className={`w-5 h-5 rounded-full bg-white ${
                      newContact.isAuthorized ? 'ml-auto' : 'mr-auto'
                    }`} />
                  </TouchableOpacity>
                </View> */}

                <View className="flex-row justify-between mt-4">
                  <TouchableOpacity
                    onPress={() => setShowAddContactModal(false)}
                    className="flex-1 mr-2 py-3 rounded-2xl bg-gray-200 items-center"
                  >
                    <Text className="text-gray-700 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={handleAddContact}
                    className="flex-1 ml-2"
                  >
                    <LinearGradient
                      colors={['#7c3aed', '#a855f7']}
                      className="py-3 rounded-2xl items-center"
                      style={{ borderRadius: 16 }}
                    >
                      <Text className="text-white font-semibold">Add Contact</Text>
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
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-6">
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
                  const contact = emergencyContacts.find(c => c.id === showContactDetails);
                  if (!contact) return null;
                  
                  return (
                    <>
                      <Text className="text-lg font-bold text-gray-800 mb-4 text-center">
                        {contact.name}
                      </Text>
                      
                      {/* Fixed: Commented out authorization toggle since it uses non-existent properties */}
                      {/* <TouchableOpacity
                        onPress={() => toggleAuthorization(contact.id)}
                        className="py-3 mb-3 rounded-2xl items-center"
                        style={{
                          backgroundColor: contact.isAuthorized ? '#fef3c7' : '#dcfce7'
                        }}
                        disabled={contact.isPrimary}
                      >
                        <Text className={`font-semibold ${
                          contact.isAuthorized ? 'text-amber-700' : 'text-green-700'
                        }`}>
                          {contact.isAuthorized ? 'Remove Authorization' : 'Grant Authorization'}
                        </Text>
                      </TouchableOpacity> */}
                      
                      <TouchableOpacity
                        onPress={() => handleCallContact(contact.phoneNumber, contact.name)}
                        className="py-3 mb-3 rounded-2xl items-center bg-green-100"
                      >
                        <Text className="text-green-700 font-semibold">Call Contact</Text>
                      </TouchableOpacity>
                      
                      {/* Fixed: Commented out isPrimary check since it's not in the interface */}
                      {/* {!contact.isPrimary && ( */}
                        <TouchableOpacity
                          onPress={() => {
                            setShowContactDetails(null);
                            handleRemoveContact(contact.id);
                          }}
                          className="py-3 mb-3 rounded-2xl items-center bg-red-100"
                        >
                          <Text className="text-red-700 font-semibold">Remove Contact</Text>
                        </TouchableOpacity>
                      {/* )} */}
                      
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
      </SafeAreaView>
    </LinearGradient>
  );
}