import { images } from '@/assets/images/images';
import CustomAlert from '@/components/CustomAlert';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { API_BASE_URL } from '@/utility';
import { useUser } from '@/contexts/UserContext';

// Mock data for events (you already had this)
const mockEvents = [
  {
    id: '1',
    title: 'Annual Sports Day',
    date: '2025-08-15',
    time: '09:00 AM',
    location: 'School Playground',
    description: 'Join us for our annual sports day celebration with fun activities for all children.',
    type: 'sports',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Parent-Teacher Meeting',
    date: '2025-07-20',
    time: '02:00 PM',
    location: 'Classroom A',
    description: 'Discuss your child\'s progress and development with their teacher.',
    type: 'meeting',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Art Exhibition',
    date: '2025-07-10',
    time: '10:00 AM',
    location: 'Art Room',
    description: 'Showcase of children\'s artwork and creative projects.',
    type: 'exhibition',
    status: 'completed'
  },
  {
    id: '4',
    title: 'School Picnic',
    date: '2025-07-25',
    time: '08:00 AM',
    location: 'City Park',
    description: 'Fun-filled day out with games, food, and activities for families.',
    type: 'outing',
    status: 'upcoming'
  }
];

export default function ParentMore() {
  const router = useRouter();
  const { user } = useUser();
  const token = (user as any)?.token ?? '';

  const [isComplaintModalVisible, setIsComplaintModalVisible] = useState(false);
  const [isEventsModalVisible, setIsEventsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDetailsModalVisible, setIsEventDetailsModalVisible] = useState(false);

  // Custom Alert State
  const [customAlert, setCustomAlert] = useState({
    visible: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
    showCancelButton: false,
    onConfirm: undefined as (() => void) | undefined
  });

  const showCustomAlert = (
    type: 'success' | 'error',
    title: string,
    message: string,
    showCancelButton: boolean = false,
    onConfirm?: () => void
  ) => {
    setCustomAlert({
      visible: true,
      type,
      title,
      message,
      showCancelButton,
      onConfirm
    });
  };

  const hideCustomAlert = () => {
    setCustomAlert(prev => ({ ...prev, visible: false }));
  };

  // Complaint form state
  const [complaintForm, setComplaintForm] = useState({
    subject: '',
    recipient: 'teacher',
    description: '',
    priority: 'medium'
  });

  const handleBack = () => {
    router.back();
  };

  const openComplaintModal = () => {
    setIsComplaintModalVisible(true);
  };

  const closeComplaintModal = () => {
    setIsComplaintModalVisible(false);
    setComplaintForm({
      subject: '',
      recipient: 'teacher',
      description: '',
      priority: 'medium'
    });
  };

  const handleComplaintSubmit = async () => {
    if (!complaintForm.subject || !complaintForm.description) {
      showCustomAlert('error', 'Error', 'Please fill all required fields');
      return;
    }

    const childId = resolveChildId();
   
    if (!childId) {
      showCustomAlert('error', 'Error', 'Unable to resolve child ID');
      return;
    }

    const payload = {
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      subject: complaintForm.subject,
      recipient: (complaintForm as any).recipient ?? 'teacher',
      description: complaintForm.description,
      child_id: Number(childId)
    };

    try {
      // optional UI feedback: close modal while request runs
      setIsComplaintModalVisible(false);

      const resp = await fetch(`${API_BASE_URL}/parent/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const text = await resp.text();
      let json: any = {};
      try { json = text ? JSON.parse(text) : {}; } catch (e) { json = { success: false, message: text || 'Invalid server response' }; }

      if (!resp.ok || !json.success) {
        console.error('Complaint submit error', resp.status, json);
        showCustomAlert('error', 'Request failed', json?.message || 'Unable to submit complaint');
        return;
      }


      // Call backend (omitted) or keep as-is
      showCustomAlert('success', 'Success', 'Complaint submitted successfully! We will review it shortly.', false, () => {
        closeComplaintModal();
      });
       
    } catch (err) {
       console.error('Complaint submit network error', err);
     showCustomAlert('error', 'Network Error', 'Unable to reach the server.');
    }
  };

  const openEventsModal = () => {
    setIsEventsModalVisible(true);
  };

  const closeEventsModal = () => {
    setIsEventsModalVisible(false);
  };

  const openEventDetails = (event: any) => {
    setSelectedEvent(event);
    setIsEventDetailsModalVisible(true);
  };

  const closeEventDetailsModal = () => {
    setIsEventDetailsModalVisible(false);
    setSelectedEvent(null);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'sports': return 'fitness-outline';
      case 'meeting': return 'people-outline';
      case 'exhibition': return 'color-palette-outline';
      case 'outing': return 'car-outline';
      default: return 'calendar-outline';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'sports': return '#10b981';
      case 'meeting': return '#3b82f6';
      case 'exhibition': return '#f59e0b';
      case 'outing': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  // Meeting Modal State and Logic
  const [isMeetingModalVisible, setIsMeetingModalVisible] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    recipient: 'teacher',
    date: '',
    time: '',
    reason: ''
  });
  const openMeetingModal = () => {
    setIsMeetingModalVisible(true);
  };
  const closeMeetingModal = () => {
    setIsMeetingModalVisible(false);
    setMeetingForm({ recipient: 'teacher', date: '', time: '', reason: '' });
  };

  // Resolve child id from user context (similar to health.tsx resolve approach)
  const resolveChildId = (): number | null => {
    const raw = (user as any)?.selectedChildId ?? null;
    if (raw && !Number.isNaN(Number(raw))) return Number(raw);

    if (user?.children && Array.isArray(user.children) && user.children.length > 0) {
      const first = user.children[0] as any;
      const idFromSession = first?.child_id ?? first?.id ?? first?.childId;
      if (idFromSession && !Number.isNaN(Number(idFromSession))) return Number(idFromSession);
    }

    return null;
  };

  // convert "HH:MM AM/PM" or "HH:MM" to "HH:MM:SS" 24h
  const to24Hour = (timeStr: string) => {
    if (!timeStr) return null;
    const t = timeStr.trim();
    // already 24h like "13:30" or "13:30:00"
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(t) && !/[AaPp][Mm]$/.test(t)) {
      const parts = t.split(':');
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
    }
    const m = t.match(/(\d{1,2}):(\d{2})\s*([AaPp][Mm])/);
    if (!m) return null;
    let hh = Number(m[1]);
    const mm = m[2];
    const ampm = m[3].toLowerCase();
    if (ampm === 'pm' && hh !== 12) hh += 12;
    if (ampm === 'am' && hh === 12) hh = 0;
    return `${String(hh).padStart(2, '0')}:${mm}:00`;
  };

  // POST to backend meeting endpoint
  const handleMeetingRequest = async () => {
    if (!meetingForm.date || !meetingForm.time || !meetingForm.reason) {
      showCustomAlert('error', 'Error', 'Please fill all fields');
      return;
    }

    const childId = resolveChildId();
    if (!childId) {
      showCustomAlert('error', 'No child selected', 'Please select a child in your profile first.');
      return;
    }

    const meeting_time = to24Hour(meetingForm.time);
    if (!meeting_time) {
      showCustomAlert('error', 'Invalid time', 'Please enter time like "09:30 AM" or "14:30".');
      return;
    }

    const payload = {
      child_id: Number(childId),
      recipient: meetingForm.recipient, // 'teacher' or 'supervisor'
      // optionally include recipient_id if you resolve a specific teacher/supervisor
      meeting_date: meetingForm.date, // YYYY-MM-DD
      meeting_time,
      reason: meetingForm.reason
    };

    try {
      const resp = await fetch(`${API_BASE_URL}/parent/meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      let json;
      try { json = await resp.json(); } catch (e) { json = { success: false, message: 'Invalid server response' }; }

      if (!resp.ok || !json.success) {
        console.error('Meeting request error', json);
        showCustomAlert('error', 'Request failed', json?.message || 'Unable to send meeting request');
        return;
      }

      showCustomAlert('success', 'Request Sent', `Meeting request sent to ${meetingForm.recipient}.`, false, closeMeetingModal);
    } catch (err) {
      console.error('Meeting request error', err);
      showCustomAlert('error', 'Network Error', 'Unable to reach the server.');
    }
  };

  const moreOptions = [
    {
      title: 'Requesting Meetings',
      description: 'Meet our staff or discuss concerns',
      item: images.doctor,
      color: ['#6366f1', '#8b5cf6'],
      onPress: openMeetingModal
    },
    {
      title: 'Complaints & Feedbacks',
      description: 'Report issues or concerns',
      item: images.complaint,
      color: ['#ec4899', '#f97316'],
      onPress: openComplaintModal
    },
    {
      title: 'View Events',
      description: 'Check upcoming and past events',
      item: images.event,
      color: ['#10b981', '#06b6d4'],
      onPress: openEventsModal
    },
    {
      title: 'Help & Support',
      description: 'Get help or contact support',
      item: images.support,
      color: ['#4E71FF', '#8DD8FF'],
      onPress: () => setIsSupportModalVisible(true)
    },
    {
      title: 'Privacy Policy',
      description: 'Read our privacy policy',
      item: images.privacy,
      color: ['#6b7280', '#9ca3af'],
      onPress: () => setIsPrivacyModalVisible(true)
    }
  ];

  // Modal states for Help & Support and Privacy Policy
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);

  return (
    <LinearGradient
      colors={['#DFC1FD', '#f3e8ff', '#F5ECFE', '#F5ECFE', '#e9d5ff', '#DFC1FD']}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#DFC1FD" />
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-4 pb-2 flex-row items-center justify-between mt-2">
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 justify-center items-center"
            >
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-gray-700 mt-8">
              More Options
            </Text>

            <View className="w-10 h-10" />
          </View>

          {/* Page Title */}
          <View className="px-6 mt-4 mb-8">
            <Text className="text-gray-600">
              Manage your account and explore additional features
            </Text>
          </View>

          {/* Options Grid */}
          <View className="px-6">
            {moreOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={option.onPress}
                activeOpacity={0.8}
                className="mb-4"
              >
                <LinearGradient
                  colors={option.color as any}
                  start={[0, 0]}
                  end={[1, 1]}
                  className="rounded-2xl p-5"
                  style={{
                    shadowColor: option.color[0],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 6,
                    borderRadius: 13
                  }}
                >
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-full bg-white bg-opacity-20 items-center justify-center mr-4">
                      <Image source={option.item as any} style={{ width: 50, height: 50 }} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-lg font-bold mb-1">
                        {option.title}
                      </Text>
                      <Text className="text-white text-sm opacity-90">
                        {option.description}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Meeting Modal */}
        <Modal
          visible={isMeetingModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeMeetingModal}
        >
          <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <TouchableOpacity className="flex-1" onPress={closeMeetingModal} activeOpacity={1} />
            <View className="rounded-t-3xl p-6" style={{ backgroundColor: 'white', maxHeight: '80%' }}>
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-gray-800">Request Meeting</Text>
                <TouchableOpacity onPress={closeMeetingModal} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                  <Ionicons name="close" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Recipient Selection */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Request to Meet *</Text>
                  <View className="flex-row flex-wrap">
                    {['teacher', 'supervisor'].map((role) => (
                      <TouchableOpacity
                        key={role}
                        onPress={() => setMeetingForm(prev => ({ ...prev, recipient: role }))}
                        className={`mr-2 mb-2 px-4 py-2 rounded-full border ${meetingForm.recipient === role ? 'bg-purple-600 border-purple-600' : 'bg-gray-100 border-gray-200'}`}
                      >
                        <Text className={`text-sm font-medium ${meetingForm.recipient === role ? 'text-white' : 'text-gray-700'}`}>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {/* Date */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Date *</Text>
                  <TextInput
                    value={meetingForm.date}
                    onChangeText={value => setMeetingForm(prev => ({ ...prev, date: value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    placeholder="YYYY-MM-DD"
                    style={{ fontSize: 16 }}
                  />
                </View>
                {/* Time */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Time *</Text>
                  <TextInput
                    value={meetingForm.time}
                    onChangeText={value => setMeetingForm(prev => ({ ...prev, time: value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    placeholder="HH:MM AM/PM"
                    style={{ fontSize: 16 }}
                  />
                </View>
                {/* Reason */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Reason *</Text>
                  <TextInput
                    value={meetingForm.reason}
                    onChangeText={value => setMeetingForm(prev => ({ ...prev, reason: value }))}
                    multiline
                    numberOfLines={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    placeholder="Briefly describe the reason for the meeting"
                    style={{ fontSize: 16, textAlignVertical: 'top' }}
                  />
                </View>
                {/* Action Buttons */}
                <View className="flex-row space-x-3 mb-4">
                  <TouchableOpacity
                    onPress={closeMeetingModal}
                    className="flex-1 py-3 rounded-xl border border-gray-300"
                    style={{ backgroundColor: '#f9fafb' }}
                  >
                    <Text className="text-center text-gray-700 font-semibold text-base">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleMeetingRequest}
                    className="flex-1 py-3 rounded-xl"
                    style={{ backgroundColor: '#7c3aed', shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
                  >
                    <Text className="text-center text-white font-semibold text-base">Request Meeting</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Complaint Modal */}
        <Modal
          visible={isComplaintModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeComplaintModal}
        >
          <View
            className="flex-1 justify-end"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <TouchableOpacity
              className="flex-1"
              onPress={closeComplaintModal}
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
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-gray-800">
                  Submit Complaints & Feedbacks
                </Text>
                <TouchableOpacity
                  onPress={closeComplaintModal}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="close" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </Text>
                  <TextInput
                    value={complaintForm.subject}
                    onChangeText={(value) => setComplaintForm(prev => ({ ...prev, subject: value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    placeholder="Brief description of the issue"
                    style={{ fontSize: 16 }}
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Complaint to*
                  </Text>
                  <View className="flex-row flex-wrap">
                    {['teacher', 'supervisor'].map((category) => (
                      <TouchableOpacity
                        key={category}
                        onPress={() => setComplaintForm(prev => ({ ...prev, recipient: category }))}
                        className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                          complaintForm.recipient === category
                            ? 'bg-purple-600 border-purple-600'
                            : 'bg-gray-100 border-gray-200'
                        }`}
                      >
                        <Text className={`text-sm font-medium ${
                          complaintForm.recipient === category ? 'text-white' : 'text-gray-700'
                        }`}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </Text>
                  <TextInput
                    value={complaintForm.description}
                    onChangeText={(value) => setComplaintForm(prev => ({ ...prev, description: value }))}
                    multiline
                    numberOfLines={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                    placeholder="Provide detailed information about your complaint..."
                    style={{
                      fontSize: 16,
                      height: 100,
                      textAlignVertical: 'top'
                    }}
                  />
                </View>

                <View className="flex-row space-x-3 mb-4">
                  <TouchableOpacity
                    onPress={closeComplaintModal}
                    className="flex-1 py-3 rounded-xl border border-gray-300"
                    style={{ backgroundColor: '#f9fafb' }}
                  >
                    <Text className="text-center text-gray-700 font-semibold text-base">
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleComplaintSubmit}
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
                      Submit Complaint
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Events Modal */}
        <Modal
          visible={isEventsModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeEventsModal}
        >
          <View
            className="flex-1 justify-end"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <TouchableOpacity
              className="flex-1"
              onPress={closeEventsModal}
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
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-gray-800">
                  Daycare Events
                </Text>
                <TouchableOpacity
                  onPress={closeEventsModal}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="close" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={mockEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => openEventDetails(item)}
                    className="mb-4 p-4 rounded-xl border border-gray-200 bg-gray-50"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2
                    }}
                  >
                    <View className="flex-row items-center">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        style={{ backgroundColor: `${getEventColor(item.type)}15` }}
                      >
                        <Ionicons name={getEventIcon(item.type) as any} size={24} color={getEventColor(item.type)} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                          {item.title}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {item.date} • {item.time}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          {item.location}
                        </Text>
                      </View>
                      <View className="items-center">
                        <View className={`px-2 py-1 rounded-full mb-2 ${item.status === 'upcoming' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                          <Text className={`text-xs font-medium ${item.status === 'upcoming' ? 'text-purple-600' : 'text-gray-600'}`}>
                            {item.status}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>

        {/* Event Details Modal */}
        <Modal
          visible={isEventDetailsModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeEventDetailsModal}
        >
          <View
            className="flex-1 justify-end"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <TouchableOpacity
              className="flex-1"
              onPress={closeEventDetailsModal}
              activeOpacity={1}
            />

            <View
              className="rounded-t-3xl p-6"
              style={{
                backgroundColor: 'white',
                maxHeight: '75%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.25,
                shadowRadius: 16,
                elevation: 16
              }}
            >
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-gray-800">
                  Event Details
                </Text>
                <TouchableOpacity
                  onPress={closeEventDetailsModal}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="close" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {selectedEvent && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View className="items-center mb-6">
                    <View
                      className="w-20 h-20 rounded-full items-center justify-center mb-4"
                      style={{ backgroundColor: `${getEventColor(selectedEvent.type)}15` }}
                    >
                      <Ionicons name={getEventIcon(selectedEvent.type) as any} size={36} color={getEventColor(selectedEvent.type)} />
                    </View>
                    <Text className="text-2xl font-bold text-gray-800 text-center">
                      {selectedEvent.title}
                    </Text>
                  </View>

                  <View className="space-y-4">
                    <View className="flex-row items-center p-4 bg-gray-50 rounded-xl">
                      <Ionicons name="calendar-outline" size={24} color="#6b7280" />
                      <View className="ml-4">
                        <Text className="text-sm font-medium text-gray-500">Date</Text>
                        <Text className="text-base font-semibold text-gray-800">{selectedEvent.date}</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center p-4 bg-gray-50 rounded-xl">
                      <Ionicons name="time-outline" size={24} color="#6b7280" />
                      <View className="ml-4">
                        <Text className="text-sm font-medium text-gray-500">Time</Text>
                        <Text className="text-base font-semibold text-gray-800">{selectedEvent.time}</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center p-4 bg-gray-50 rounded-xl">
                      <Ionicons name="location-outline" size={24} color="#6b7280" />
                      <View className="ml-4">
                        <Text className="text-sm font-medium text-gray-500">Location</Text>
                        <Text className="text-base font-semibold text-gray-800">{selectedEvent.location}</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center p-4 bg-gray-50 rounded-xl">
                      <Ionicons name="checkmark-circle-outline" size={24} color="#6b7280" />
                      <View className="ml-4">
                        <Text className="text-sm font-medium text-gray-500">Status</Text>
                        <Text className={`text-base font-semibold ${selectedEvent.status === 'upcoming' ? 'text-green-600' : 'text-gray-600'}`}>
                          {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                        </Text>
                      </View>
                    </View>

                    <View className="p-4 bg-gray-50 rounded-xl">
                      <Text className="text-sm font medium text-gray-500 mb-2">Description</Text>
                      <Text className="text-base text-gray-800 leading-6">
                        {selectedEvent.description}
                      </Text>
                    </View>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md">
        <View
          className="flex-row justify-around items-center py-4 px-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Pressable
            className="items-center justify-center py-2"
            onPress={() => router.push('/ParentDashboard')}
          >
            <View className="w-12 h-12 items-center justify-center">
              <Ionicons name="home" size={24} color="#9ca3af" />
            </View>
            <Text className="text-xs text-gray-500 font-medium mt-1">Home</Text>
          </Pressable>

          <Pressable
            className="items-center justify-center py-2"
            onPress={() => router.push('/ParentProfile')}
          >
            <View className="w-12 h-12 items-center justify-center">
              <Ionicons name="person" size={24} color="#9ca3af" />
            </View>
            <Text className="text-xs text-gray-500 mt-1">Profile</Text>
          </Pressable>

          <Pressable className="items-center justify-center py-2" >
            <View className="w-12 h-12 items-center justify-center">
              <Ionicons name="ellipsis-horizontal" size={24} color="#7c3aed" />
            </View>
            <Text className="text-xs text-purple-600 mt-1">More</Text>
          </Pressable>
        </View>
      </View>

      {/* Help & Support Modal */}
      <Modal
        visible={isSupportModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSupportModalVisible(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity className="flex-1" onPress={() => setIsSupportModalVisible(false)} activeOpacity={1} />
          <View className="rounded-t-3xl p-6" style={{ backgroundColor: 'white', maxHeight: '60%' }}>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-800">Help & Support</Text>
              <TouchableOpacity onPress={() => setIsSupportModalVisible(false)} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                <Ionicons name="close" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View className="mb-4">
              <Text className="text-base text-gray-700 mb-2">Contact Numbers</Text>
              <View className="mb-2">
                <Text className="text-lg font-semibold text-purple-700">011-2345678</Text>
                <Text className="text-lg font-semibold text-purple-700">011-8765432</Text>
              </View>
              <Text className="text-base text-gray-700 mb-2 mt-4">Email Addresses</Text>
              <View>
                <Text className="text-lg font-semibold text-purple-700">info@littlesteps.com</Text>
                <Text className="text-lg font-semibold text-purple-700">support@littlesteps.com</Text>
              </View>
            </View>
            <Text className="text-sm text-gray-500">We are here to help you with any questions or concerns regarding your child&apos;s care and experience at our daycare centre.</Text>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={isPrivacyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPrivacyModalVisible(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity className="flex-1" onPress={() => setIsPrivacyModalVisible(false)} activeOpacity={1} />
          <View className="rounded-t-3xl p-6" style={{ backgroundColor: 'white', maxHeight: '70%' }}>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-800">Privacy Policy</Text>
              <TouchableOpacity onPress={() => setIsPrivacyModalVisible(false)} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                <Ionicons name="close" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={true}>
              <Text className="text-base text-gray-700 mb-4 font-semibold">Rules and Regulations</Text>
              <Text className="text-sm text-gray-700 mb-2">1. All personal information is kept confidential and is only used for daycare operations.</Text>
              <Text className="text-sm text-gray-700 mb-2">2. We do not share your data with third parties without your consent.</Text>
              <Text className="text-sm text-gray-700 mb-2">3. You have the right to access, update, or request deletion of your data at any time.</Text>
              <Text className="text-sm text-gray-700 mb-2">4. Our staff are trained to handle your information securely and responsibly.</Text>
              <Text className="text-sm text-gray-700 mb-2">5. For more details, please contact our support team.</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Custom Alert */}
      <CustomAlert
        visible={customAlert.visible}
        type={customAlert.type}
        title={customAlert.title}
        message={customAlert.message}
        onClose={hideCustomAlert}
        onConfirm={customAlert.onConfirm}
        showCancelButton={customAlert.showCancelButton}
        confirmText={customAlert.showCancelButton ? 'Yes' : 'OK'}
        cancelText="Cancel"
      />
    </LinearGradient>
  );
}