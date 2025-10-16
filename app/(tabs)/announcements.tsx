import { API_BASE_URL } from '@/utility/index';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Calendar, Clock } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Announcement = {
  ann_id: number;
  title: string;
  details: string;
  user_id: string;
  date: string;
  time: string;
  isRead: boolean;
};

const { width } = Dimensions.get('window');

export default function Announcements() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_BASE_URL}/parent/announcements/parent`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        const formattedData = data.map((item: any) => ({
          ...item,
          isRead: false, // Local state
        }));

        setAnnouncementList(
          [...formattedData].sort((a, b) => Number(a.isRead) - Number(b.isRead))
        );
      } catch (err) {
        setError('Could not load announcements');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const unreadCount = announcementList.filter((item: Announcement) => !item.isRead).length;

  const filteredAnnouncements = announcementList.filter((item: Announcement) => {
    if (selectedTab === 'all') return true;
    // if (selectedTab === 'unread') return !item.isRead;
    // if (selectedTab === 'read') return item.isRead;
  });

  const markAsRead = (id: number) => {
    setAnnouncementList((prev: Announcement[]) =>
      prev.map((item: Announcement) =>
        item.ann_id === id ? { ...item, isRead: true } : item
      )
    );
  };

  const markAllAsRead = () => {
    setAnnouncementList((prev: Announcement[]) =>
      prev.map((item: Announcement) => ({ ...item, isRead: true }))
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <Pressable
      onPress={() => !item.isRead && markAsRead(item.ann_id)}
      className="mx-4 mb-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View
        className={`rounded-2xl overflow-hidden ${
          item.isRead ? 'bg-gray-50' : 'bg-white'
        }`}
        style={{
          borderLeftWidth: 4,
          borderLeftColor: '#8b5cf6',
        }}
      >
        <View className="p-4">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <Ionicons name="information-circle" size={18} color="#8b5cf6" />
                <Text
                  className={`ml-2 text-base font-bold ${
                    item.isRead ? 'text-gray-700' : 'text-gray-900'
                  }`}
                >
                  {item.title}
                </Text>
              </View>
{/* 
              <Text className="text-xs text-gray-500">
                User ID: {item.user_id}
              </Text> */}
            </View>

            {!item.isRead && (
              <View className="w-3 h-3 bg-blue-500 rounded-full mb-1" />
            )}
          </View>

          <Text
            className={`text-sm mb-3 leading-5 ${
              item.isRead ? 'text-gray-600' : 'text-gray-800'
            }`}
          >
            {item.details}
          </Text>

          {!item.isRead && (
            <TouchableOpacity
              onPress={() => markAsRead(item.ann_id)}
              className="self-start mb-2 px-3 py-1 bg-purple-100 rounded-full"
            >
              <Text className="text-purple-700 text-xs font-semibold">
                Mark as Read
              </Text>
            </TouchableOpacity>
          )}

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Calendar size={14} color="#6b7280" />
              <Text className="text-xs text-gray-500 ml-1">
                {formatDate(item.date)}
              </Text>
              <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
              <Clock size={14} color="#6b7280" />
              <Text className="text-xs text-gray-500 ml-1">{item.time}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="mt-4 text-gray-600">Loading announcements...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-red-600 mb-2">Error</Text>
        <Text className="text-gray-500">{error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#DFC1FD', '#f3e8ff', '#F5ECFE', '#F5ECFE', '#e9d5ff', '#DFC1FD']}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#DFC1FD" />

      <View className="pt-12 pb-6 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 rounded-full bg-white/30"
            >
              <ArrowLeft size={20} color="#374151" />
            </TouchableOpacity>
            <View>
              <Text className="text-gray-700 text-2xl font-bold">
                Announcements
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {unreadCount} unread messages
              </Text>
            </View>
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              className="px-4 py-2 bg-white/30 rounded-full"
            >
              <Text className="text-purple-700 text-sm font-medium">
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row bg-white/30 rounded-2xl p-1">
          {['all'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              className={`flex-1 py-2 px-4 rounded-xl ${
                selectedTab === tab ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text
                className={`text-center text-sm font-medium capitalize ${
                  selectedTab === tab ? 'text-purple-700' : 'text-gray-600'
                }`}
              >
                {tab}
                {tab === 'unread' && unreadCount > 0 && (
                  <Text className="text-purple-600"> ({unreadCount})</Text>
                )}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-1 bg-gray-50 rounded-t-[30px] pt-6">
        {filteredAnnouncements.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <Bell size={48} color="#d1d5db" />
            <Text className="text-lg font-semibold text-gray-600 mt-4 mb-2">
              No announcements
            </Text>
            <Text className="text-gray-500 text-center">
              {selectedTab === 'unread'
                ? "You're all caught up! No unread announcements."
                : 'No announcements available at the moment.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredAnnouncements}
            keyExtractor={(item) => item.ann_id.toString()}
            renderItem={renderAnnouncement}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </LinearGradient>
  );
}
