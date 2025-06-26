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
  StyleSheet
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
  Smile
} from 'lucide-react-native';

const childData = {
  name: 'Ishadi Thashmika',
  age: '2 years old',
  gender: 'girl',
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
  const [specialNote, setSpecialNote] = useState('');
  const router = useRouter();

  const isGirl = childData.gender === 'girl';
  const themeColor = isGirl ? '#ec4899' : '#3b82f6';

  const handleSendNote = () => {
    if (specialNote.trim()) {
      alert(`Note sent: ${specialNote}`);
      setSpecialNote('');
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
    <ScrollView className="p-4 bg-gray-100 flex-1">
      <View className="bg-white rounded-3xl p-6 mb-6">
        <View className="flex-row items-center space-x-4">
          <Image source={{ uri: childData.photo }} style={styles.avatar} />
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900">{childData.name}</Text>
            <Text className="text-sm text-gray-600">{childData.age}</Text>
            <View className="flex-row items-center mt-1">
              <Phone size={14} color="gray" />
              <Text className="ml-1 text-sm text-gray-700">{childData.phone}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          className="mt-4 w-full rounded-xl py-2 bg-pink-500"
          onPress={() => router.push('/teacher/child-profile')}
        >
          <Text className="text-white text-center font-semibold">View Profile</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-3xl p-6 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">Today Record</Text>
          <View className="flex-row items-center">
            <Calendar size={16} color="gray" />
            <Text className="ml-1 text-sm text-gray-600">{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowReports(true)}
          className="bg-gray-100 rounded-2xl p-4 mb-2"
        >
          <View className="flex-row items-center">
            <FileText size={24} color={themeColor} />
            <View className="ml-3">
              <Text className="font-semibold text-gray-700">View Today's Details</Text>
              <Text className="text-gray-500 text-sm">Tap to view details</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

// Add this in your ChildPage component, right after the "View Profile" button
<TouchableOpacity
  className="mt-4 w-full rounded-xl py-2 bg-blue-500"
  onPress={() => router.push('/teacher/daily-report-form')}
>
  <Text className="text-white text-center font-semibold">Start Today's Report</Text>
</TouchableOpacity>

      <View className="bg-white rounded-3xl p-6 mb-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">Special Note</Text>
        <TextInput
          value={specialNote}
          onChangeText={setSpecialNote}
          multiline
          placeholder="Write a note..."
          className="border border-gray-300 rounded-xl p-4 h-28 text-gray-700"
        />
        <TouchableOpacity
          disabled={!specialNote.trim()}
          onPress={handleSendNote}
          className="mt-4 bg-pink-500 py-3 rounded-xl disabled:opacity-50"
        >
          <View className="flex-row justify-center items-center">
            <Text className="text-white font-semibold">Send Note</Text>
            <Send size={16} color="white" style={{ marginLeft: 8 }} />
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
              <Text className="text-xl font-bold text-gray-800">Today's Reports</Text>
              <TouchableOpacity onPress={() => setShowReports(false)}>
                <X size={20} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {todayReports.map((report) => {
                const Icon = report.icon;
                const [bgColor, textColor] = getActivityColor(report.type);
                return (
                  <View
                    key={report.id}
                    className="flex-row items-start space-x-4 bg-gray-50 p-4 mb-2 rounded-2xl"
                  >
                    <View style={{ backgroundColor: bgColor }} className="p-2 rounded-xl">
                      <Icon size={16} color={textColor} />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row justify-between mb-1">
                        <Text className="font-semibold text-gray-800">{report.activity}</Text>
                        <View className="flex-row items-center">
                          <Clock size={12} color="gray" />
                          <Text className="ml-1 text-xs text-gray-500">{report.time}</Text>
                        </View>
                      </View>
                      <Text className="text-sm text-gray-600">{report.description}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowReports(false)}
              className="mt-4 bg-pink-500 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">Close Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
  }
});
