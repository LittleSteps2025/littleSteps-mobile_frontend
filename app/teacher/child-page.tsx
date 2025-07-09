// ChildPage.tsx (React Native version with Expo + Tailwind via nativewind)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Phone,
  Calendar,
  FileText,
  Send,
  X,
  Clock,
  Heart,
  Utensils,
  Moon,
  Smile,
  Users,
  ArrowLeft
} from 'lucide-react-native';

const childData = {
  name: 'Ishadi Thashmika',
  age: '2 years old',
  gender: 'girl',
  group: 'Rainbow Group',
  phone: '077-1231423',
  photo: 'https://images.pexels.com/photos/1104007/pexels-photo-1104007.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
};

const todayReports = [
  {
    id: 1,
    time: '9:00 AM',
    activity: 'Arrival',
    description: 'Arrived happy and ready to play',
    icon: Smile,
    type: 'arrival'
  },
  {
    id: 2,
    time: '10:30 AM',
    activity: 'Snack Time',
    description: 'Enjoyed apple slices and crackers',
    icon: Utensils,
    type: 'meal'
  },
  {
    id: 3,
    time: '12:00 PM',
    activity: 'Nap Time',
    description: 'Slept peacefully for 1.5 hours',
    icon: Moon,
    type: 'sleep'
  },
  {
    id: 4,
    time: '2:30 PM',
    activity: 'Play Activity',
    description: 'Participated in arts and crafts - made a beautiful painting',
    icon: Heart,
    type: 'activity'
  }
];

export default function ChildPage() {
  const [showReports, setShowReports] = useState(false);
  const [emergencyNote, setEmergencyNote] = useState('');
  const router = useRouter();

  const isGirl = childData.gender === 'girl';
  const themeColor = isGirl ? '#ec4899' : '#3b82f6';

  const handleCall = () => {
    const phoneNumber = childData.phone.replace(/[^0-9]/g, ''); // Remove any formatting
    const phoneUrl = `tel:${phoneNumber}`;
    
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'Phone calls are not supported on this device');
        }
      })
      .catch((err) => {
        Alert.alert('Error', 'Failed to make phone call');
        console.error('Phone call error:', err);
      });
  };

  const handleSendEmergencyNote = () => {
    if (emergencyNote.trim()) {
      Alert.alert(
        'Emergency Note Sent',
        `Emergency note sent to parents: ${emergencyNote}`,
        [
          {
            text: 'OK',
            onPress: () => setEmergencyNote('')
          }
        ]
      );
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'arrival': return ['#bbf7d0', '#166534'];
      case 'meal': return ['#fed7aa', '#c2410c'];
      case 'sleep': return ['#ddd6fe', '#5b21b6'];
      case 'activity': return ['#fbcfe8', '#9d174d'];
      default: return ['#e5e7eb', '#374151'];
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        className="p-4 bg-gray-100 flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with Back Button */}
        <View className="flex-row items-center mb-4 pt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white rounded-full p-3 shadow-sm mr-4"
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 flex-1">Child Details</Text>
        </View>

        {/* Profile Card */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center space-x-4">
            <Image source={{ uri: childData.photo }} style={styles.avatar} />
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">{childData.name}</Text>
              <Text className="text-sm text-gray-600 mb-1">{childData.age}</Text>
              
              {/* Group Information */}
              <View className="flex-row items-center mb-2">
                <Users size={14} color="gray" />
                <Text className="ml-1 text-sm text-gray-700">{childData.group}</Text>
              </View>
              
              {/* Clickable Phone Number */}
              <TouchableOpacity 
                onPress={handleCall}
                className="flex-row items-center"
              >
                <Phone size={14} color={themeColor} />
                <Text className="ml-1 text-sm font-medium" style={{ color: themeColor }}>
                  {childData.phone}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* View Profile Button */}
          <TouchableOpacity
            className="mt-4 w-full rounded-xl py-3"
            style={{ backgroundColor: themeColor }}
            onPress={() => router.push('/teacher/child-profile')}
          >
            <Text className="text-white text-center font-semibold">View Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Reports Section */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Today's Reports</Text>
            <View className="flex-row items-center">
              <Calendar size={16} color="gray" />
              <Text className="ml-1 text-sm text-gray-600">{new Date().toLocaleDateString()}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setShowReports(true)}
            className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <FileText size={24} color={themeColor} />
                <View className="ml-3">
                  <Text className="font-semibold text-gray-700">View Today's Activity Details</Text>
                  <Text className="text-gray-500 text-sm">Tap to view complete reports</Text>
                </View>
              </View>
              <View className="bg-gray-200 rounded-full px-3 py-1">
                <Text className="text-xs font-medium text-gray-600">{todayReports.length} activities</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Emergency Notes Section */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Emergency Notes</Text>
          <Text className="text-sm text-gray-600 mb-3">Send urgent notifications to parents</Text>
          
          <TextInput
            value={emergencyNote}
            onChangeText={setEmergencyNote}
            multiline
            placeholder="Type your emergency note here..."
            placeholderTextColor="#9ca3af"
            className="border border-gray-300 rounded-xl p-4 h-32 text-gray-700 bg-gray-50"
            textAlignVertical="top"
          />
          
          <TouchableOpacity
            disabled={!emergencyNote.trim()}
            onPress={handleSendEmergencyNote}
            className="mt-4 py-3 rounded-xl"
            style={{ 
              backgroundColor: emergencyNote.trim() ? '#ef4444' : '#d1d5db'
            }}
          >
            <View className="flex-row justify-center items-center">
              <Text className={`font-semibold ${emergencyNote.trim() ? 'text-white' : 'text-gray-500'}`}>
                Send Emergency Note
              </Text>
              <Send 
                size={16} 
                color={emergencyNote.trim() ? 'white' : '#6b7280'} 
                style={{ marginLeft: 8 }} 
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Reports Modal */}
        <Modal
          visible={showReports}
          transparent
          animationType="slide"
          onRequestClose={() => setShowReports(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800">Today's Activity Reports</Text>
                <TouchableOpacity onPress={() => setShowReports(false)}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              
              <ScrollView showsVerticalScrollIndicator={false}>
                {todayReports.map((report) => {
                  const Icon = report.icon;
                  const [bgColor, textColor] = getActivityColor(report.type);
                  return (
                    <View
                      key={report.id}
                      className="flex-row items-start space-x-4 bg-gray-50 p-4 mb-3 rounded-2xl"
                    >
                      <View style={{ backgroundColor: bgColor }} className="p-3 rounded-xl">
                        <Icon size={18} color={textColor} />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row justify-between items-start mb-2">
                          <Text className="font-semibold text-gray-800 text-base">{report.activity}</Text>
                          <View className="flex-row items-center bg-white px-2 py-1 rounded-lg">
                            <Clock size={12} color="gray" />
                            <Text className="ml-1 text-xs text-gray-500 font-medium">{report.time}</Text>
                          </View>
                        </View>
                        <Text className="text-sm text-gray-600 leading-5">{report.description}</Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
              
              <TouchableOpacity
                onPress={() => setShowReports(false)}
                className="mt-4 py-3 rounded-xl"
                style={{ backgroundColor: themeColor }}
              >
                <Text className="text-white text-center font-semibold">Close Reports</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  }
});