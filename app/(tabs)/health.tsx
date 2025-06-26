// app/health.tsx
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
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface HealthRecord {
  id: string;
  date: string;
  type: 'checkup' | 'vaccination' | 'illness' | 'medication';
  title: string;
  description: string;
  doctor?: string;
}

export default function HealthRecords() {
  const router = useRouter();
  
  // Health information state
  const [healthData, setHealthData] = useState({
    allergies: 'Prawns',
    medications: 'Piriton 10mg',
    bloodType: 'O+',
    emergencyMedicalInfo: 'No special instructions'
  });

  // Sample health records
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'checkup',
      title: 'Annual Physical Checkup',
      description: 'Routine physical examination. All vitals normal.',
    },
    {
      id: '2',
      date: '2024-02-20',
      type: 'vaccination',
      title: 'MMR Vaccine',
      description: 'Second dose of MMR vaccine administered.',
    },
    {
      id: '3',
      date: '2024-03-10',
      type: 'illness',
      title: 'Common Cold',
      description: 'Mild cold symptoms. Prescribed rest and fluids.',
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: '',
    type: 'checkup' as const,
    title: '',
    description: '',
    doctor: ''
  });

  const handleBack = () => {
    router.back();
  };

  const handleHealthDataChange = (field: string, value: string) => {
    setHealthData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveHealthData = () => {
    Alert.alert('Success', 'Health information updated successfully!');
    setIsEditing(false);
  };

  const handleAddRecord = () => {
    if (!newRecord.title || !newRecord.date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const record: HealthRecord = {
      id: Date.now().toString(),
      ...newRecord
    };

    setHealthRecords(prev => [record, ...prev]);
    setNewRecord({
      date: '',
      type: 'checkup',
      title: '',
      description: '',
      doctor: ''
    });
    setShowAddRecord(false);
    Alert.alert('Success', 'Health record added successfully!');
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'checkup': return 'medical';
      case 'vaccination': return 'shield-checkmark';
      case 'illness': return 'thermometer';
      case 'medication': return 'medical';
      default: return 'document-text';
    }
  };

  const getRecordColor = (type: string): [string, string] => {
    switch (type) {
      case 'checkup': return ['#10b981', '#059669'];
      case 'vaccination': return ['#3b82f6', '#2563eb'];
      case 'illness': return ['#f59e0b', '#d97706'];
      case 'medication': return ['#8b5cf6', '#7c3aed'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
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
                Health Records
              </Text>
              
              <TouchableOpacity 
                onPress={() => setShowAddRecord(true)}
                className="w-10 h-10 justify-center items-center mt-12"
              >
                <Ionicons name="add" size={24} color="#7c3aed" />
              </TouchableOpacity>
            </View>

            {/* Medical Information Card */}
            <View className="px-6 mt-4">
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
                    Medical Information
                  </Text>
                  <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center">
                    <Ionicons name="medical" size={18} color="#7c3aed" />
                  </View>
                </View>

                {/* Details Grid */}
                <View className="space-y-4">
                  {/* Blood Type */}
                  <View className="flex-row items-center py-3 border-b border-gray-100">
                    <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center mr-4">
                      <Ionicons name="water-outline" size={18} color="#ef4444" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-500 mb-1">
                        Blood Type
                      </Text>
                      <Text className="text-base font-semibold text-gray-800">
                        {healthData.bloodType}
                      </Text>
                    </View>
                  </View>

                  {/* Allergies */}
                  <View className="flex-row items-center py-3 border-b border-gray-100">
                    <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mr-4">
                      <Ionicons name="warning-outline" size={18} color="#f97316" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-500 mb-1">
                        Allergies
                      </Text>
                      <Text className="text-base font-semibold text-gray-800">
                        {healthData.allergies}
                      </Text>
                    </View>
                  </View>

                  {/* Current Medications */}
                  <View className="flex-row items-center py-3 border-b border-gray-100">
                    <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center mr-4">
                      <Ionicons name="medical-outline" size={18} color="#10b981" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-500 mb-1">
                        Current Medications
                      </Text>
                      <Text className="text-base font-semibold text-gray-800">
                        {healthData.medications}
                      </Text>
                    </View>
                  </View>

                  {/* Emergency Medical Info */}
                  <View className="flex-row items-center py-3">
                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-4">
                      <Ionicons name="alert-circle-outline" size={18} color="#3b82f6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-500 mb-1">
                        Emergency Medical Info
                      </Text>
                      <Text className="text-base font-semibold text-gray-800">
                        {healthData.emergencyMedicalInfo}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Edit Medical Information Button */}
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
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
                      Edit Medical Information
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Health Records Section */}
              <View className="mb-8">
                <Text className="text-xl font-bold text-gray-700 mb-6">
                  Health Records History
                </Text>

                {healthRecords.map((record) => (
                  <View
                    key={record.id}
                    className="mb-4 p-4 rounded-2xl"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 6,
                      elevation: 3
                    }}
                  >
                    <View className="flex-row items-start">
                      <LinearGradient
                        colors={getRecordColor(record.type)}
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      >
                        <Ionicons 
                          name={getRecordIcon(record.type) as keyof typeof Ionicons.glyphMap} 
                          size={24} 
                          color="white" 
                        />
                      </LinearGradient>
                      
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-800 mb-1">
                          {record.title}
                        </Text>
                        <Text className="text-sm text-gray-600 mb-2">
                          {formatDate(record.date)}
                        </Text>
                        <Text className="text-gray-700 mb-2">
                          {record.description}
                        </Text>
                        {record.doctor && (
                          <Text className="text-sm text-purple-600 font-medium">
                            {record.doctor}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Edit Medical Information Modal */}
        <Modal
          visible={isEditing}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsEditing(false)}
        >
          <View className="flex-1 justify-end bg-black bg-opacity-50">
            <View 
              className="bg-white rounded-t-3xl p-6"
              style={{ 
                paddingBottom: Platform.OS === 'ios' ? 34 : 24,
                maxHeight: '80%'
              }}
            >
              <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
              
              <Text className="text-xl font-bold text-gray-800 mb-6 text-center">
                Edit Medical Information
              </Text>
              
              <ScrollView showsVerticalScrollIndicator={false}>
                <InputField
                  label="Blood Type"
                  value={healthData.bloodType}
                  onChangeText={(value: string) => handleHealthDataChange('bloodType', value)}
                  placeholder="Enter blood type"
                />

                <InputField
                  label="Allergies"
                  value={healthData.allergies}
                  onChangeText={(value: string) => handleHealthDataChange('allergies', value)}
                  placeholder="List any allergies (or 'None')"
                  multiline={true}
                  numberOfLines={3}
                />

                <InputField
                  label="Current Medications"
                  value={healthData.medications}
                  onChangeText={(value: string) => handleHealthDataChange('medications', value)}
                  placeholder="List current medications (or 'None')"
                  multiline={true}
                  numberOfLines={3}
                />

                <InputField
                  label="Emergency Medical Information"
                  value={healthData.emergencyMedicalInfo}
                  onChangeText={(value: string) => handleHealthDataChange('emergencyMedicalInfo', value)}
                  placeholder="Special instructions for emergencies"
                  multiline={true}
                  numberOfLines={3}
                />

                <View className="flex-row justify-between mt-4">
                  <TouchableOpacity
                    onPress={() => setIsEditing(false)}
                    className="flex-1 mr-2 py-3 rounded-2xl bg-gray-200 items-center"
                  >
                    <Text className="text-gray-700 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={handleSaveHealthData}
                    className="flex-1 ml-2"
                  >
                    <LinearGradient
                      colors={['#7c3aed', '#a855f7']}
                      className="py-3 rounded-2xl items-center"
                      style={{ borderRadius: 16 }}
                    >
                      <Text className="text-white font-semibold rounded-xl">Save Changes</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Add Record Modal */}
        <Modal
          visible={showAddRecord}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddRecord(false)}
        >
          <View className="flex-1 justify-end bg-black bg-opacity-50">
            <View 
              className="bg-white rounded-t-3xl p-6"
              style={{ 
                paddingBottom: Platform.OS === 'ios' ? 34 : 24,
                maxHeight: '80%'
              }}
            >
              <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
              
              <Text className="text-xl font-bold text-gray-800 mb-6 text-center">
                Add Health Record
              </Text>
              
              <ScrollView showsVerticalScrollIndicator={false}>
                <InputField
                  label="Date *"
                  value={newRecord.date}
                  onChangeText={(value: string) => setNewRecord(prev => ({ ...prev, date: value }))}
                  placeholder="YYYY-MM-DD"
                />

                <InputField
                  label="Title *"
                  value={newRecord.title}
                  onChangeText={(value: string) => setNewRecord(prev => ({ ...prev, title: value }))}
                  placeholder="Enter record title"
                />

                <InputField
                  label="Description"
                  value={newRecord.description}
                  onChangeText={(value: string) => setNewRecord(prev => ({ ...prev, description: value }))}
                  placeholder="Enter description"
                  multiline={true}
                  numberOfLines={3}
                />

                <View className="flex-row justify-between mt-4">
                  <TouchableOpacity
                    onPress={() => setShowAddRecord(false)}
                    className="flex-1 mr-2 py-3 rounded-2xl bg-gray-200 items-center"
                  >
                    <Text className="text-gray-700 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={handleAddRecord}
                    className="flex-1 ml-2"
                  >
                    <LinearGradient
                      colors={['#7c3aed', '#a855f7']}
                      className="py-3 rounded-2xl items-center"
                      style={{ borderRadius: 16 }}
                    >
                      <Text className="text-white font-semibold">Add Record</Text>
                    </LinearGradient>
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