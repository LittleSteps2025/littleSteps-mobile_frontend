import { API_BASE_URL } from "@/utility/index";
import { useChildId } from "@/hooks/useChildId";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, Calendar, Clock } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Meeting = {
  meeting_id: number;
  child_id: number;
  recipient: string;
  meeting_date: string;
  meeting_time: string;
  reason: string;
  response: string | null;
  type: "meeting";
};

type Announcement = {
  ann_id: number;
  title: string;
  details: string;
  user_id: string;
  date: string;
  time: string;
  isRead: boolean;
  type: "announcement";
};

type Event = {
  event_id: number;
  topic: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  type: "event";
};

type NotificationItem = Meeting | Announcement | Event;

export default function Announcements() {
  const [notificationList, setNotificationList] = useState<NotificationItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { childId } = useChildId();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!childId) return; // Wait for childId to be available

      try {
        setLoading(true);
        setError("");

        // Fetch both meetings, announcements, and events in parallel
        const [meetingsResponse, announcementsResponse, eventsResponse] =
          await Promise.all([
            fetch(
              `${API_BASE_URL}/parent/announcements/meeting/child/${childId}`
            ),
            fetch(`${API_BASE_URL}/parent/announcements/parent`),
            fetch(`${API_BASE_URL}/parents/events`).catch(() => null), // Make events optional
          ]);

        if (!meetingsResponse.ok) throw new Error("Failed to fetch meetings");
        if (!announcementsResponse.ok)
          throw new Error("Failed to fetch announcements");

        const meetingsData = await meetingsResponse.json();
        const announcementsData = await announcementsResponse.json();
        const eventsData =
          eventsResponse && eventsResponse.ok
            ? await eventsResponse.json()
            : { data: [] };

        // Add type field and combine
        const meetings = (meetingsData.data || []).map((item: any) => ({
          ...item,
          type: "meeting" as const,
        }));
        const announcements = (announcementsData || []).map((item: any) => ({
          ...item,
          type: "announcement" as const,
        }));
        const events = (eventsData.data || eventsData || []).map(
          (item: any) => ({
            ...item,
            type: "event" as const,
          })
        );

        // Combine and remove duplicates based on type and ID
        const combined = [...meetings, ...announcements, ...events];
        const uniqueCombined = combined.filter((item, index, self) => {
          const key = `${item.type}_${item.type === "meeting" ? item.meeting_id : item.type === "announcement" ? item.ann_id : item.event_id}`;
          return (
            self.findIndex(
              (other) =>
                `${other.type}_${other.type === "meeting" ? other.meeting_id : other.type === "announcement" ? other.ann_id : other.event_id}` ===
                key
            ) === index
          );
        });

        // Filter out expired notifications (past dates) for meetings and events only
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today
        const activeNotifications = uniqueCombined.filter((item) => {
          if (item.type === "announcement") return true; // Show all announcements
          const itemDate = new Date(
            item.type === "meeting" ? item.meeting_date : item.date
          );
          itemDate.setHours(0, 0, 0, 0); // Set to start of the notification date
          return itemDate >= today;
        });

        // Sort by date (most recent first)
        const sortedCombined = activeNotifications.sort((a, b) => {
          const dateA =
            a.type === "meeting" ? new Date(a.meeting_date) : new Date(a.date);
          const dateB =
            b.type === "meeting" ? new Date(b.meeting_date) : new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        setNotificationList(sortedCombined);
      } catch {
        setError("Could not load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [childId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusColor = (response: string | null) => {
    if (!response) return "#eab308"; // yellow for pending
    if (response?.toLowerCase() === "cancel") return "#ef4444"; // red for cancelled
    return "#10b981"; // green for complete
  };

  const getStatusText = (response: string | null) => {
    if (!response) return "Pending";
    if (response?.toLowerCase() === "cancel") return "Cancelled";
    return "Complete";
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    if (item.type === "meeting") {
      return (
        <View
          className="mx-4 mb-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            height: 140, // Fixed height for consistent layout
          }}
        >
          <View
            className="rounded-2xl overflow-hidden bg-white"
            style={{
              borderLeftWidth: 4,
              borderLeftColor: getStatusColor(item.response),
            }}
          >
            <View className="p-4">
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar" size={18} color="#8b5cf6" />
                    <Text className="ml-2 text-base font-bold text-gray-900">
                      Meeting Request
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 mb-2">
                    With: {item.recipient}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Text
                    className="text-xs font-semibold mr-2"
                    style={{ color: getStatusColor(item.response) }}
                  >
                    {getStatusText(item.response)}
                  </Text>
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(item.response) }}
                  />
                </View>
              </View>

              <Text className="text-sm mb-3 leading-5 text-gray-800">
                {item.reason}
              </Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Calendar size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {formatDate(item.meeting_date)}
                  </Text>
                  <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                  <Clock size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {item.meeting_time}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    } else if (item.type === "event") {
      return (
        <View
          className="mx-4 mb-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            height: 140, // Fixed height for consistent layout
          }}
        >
          <View
            className="rounded-2xl overflow-hidden bg-white"
            style={{
              borderLeftWidth: 4,
              borderLeftColor: "#10b981", // Green for events
            }}
          >
            <View className="p-4">
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#10b981"
                    />
                    <Text className="ml-2 text-base font-bold text-gray-900">
                      {item.topic}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 mb-2">
                    📍 {item.venue}
                  </Text>
                </View>
              </View>

              <Text className="text-sm mb-3 leading-5 text-gray-800">
                {item.description}
              </Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Calendar size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {formatDate(item.date)}
                  </Text>
                  <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                  <Clock size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {item.time}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      // Render announcement
      return (
        <View
          className="mx-4 mb-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            height: 140, // Fixed height for consistent layout
          }}
        >
          <View
            className="rounded-2xl overflow-hidden bg-white"
            style={{
              borderLeftWidth: 4,
              borderLeftColor: "#3b82f6", // Blue for announcements
            }}
          >
            <View className="p-4">
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Bell size={18} color="#3b82f6" />
                    <Text className="ml-2 text-base font-bold text-gray-900">
                      {item.title}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 mb-2">
                    Announcement
                  </Text>
                </View>
              </View>

              <Text className="text-sm mb-3 leading-5 text-gray-800">
                {item.details}
              </Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Calendar size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {formatDate(item.date)}
                  </Text>
                  <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                  <Clock size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {item.time}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
  };

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
      colors={[
        "#DFC1FD",
        "#f3e8ff",
        "#F5ECFE",
        "#F5ECFE",
        "#e9d5ff",
        "#DFC1FD",
      ]}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#DFC1FD" />

      <View className="pt-12 pb-6 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-gray-700 text-2xl font-bold">
              Notifications
            </Text>
          </View>
        </View>

        <View className="flex-row bg-white/30 rounded-2xl p-1">
          <TouchableOpacity className="flex-1 py-2 px-4 rounded-xl bg-white shadow-sm">
            <Text className="text-center text-sm font-medium capitalize text-purple-700">
              All Notifications
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 bg-gray-50 rounded-t-[30px] pt-6">
        {notificationList.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <Bell size={48} color="#d1d5db" />
            <Text className="text-lg font-semibold text-gray-600 mt-4 mb-2">
              No notifications
            </Text>
            <Text className="text-gray-500 text-center">
              No notifications available at the moment.
            </Text>
          </View>
        ) : (
          <FlatList
            data={notificationList}
            keyExtractor={(item, index) => {
              const baseId =
                item.type === "meeting"
                  ? item.meeting_id
                  : item.type === "announcement"
                    ? item.ann_id
                    : item.event_id;
              return `${item.type}_${baseId}_${index}`;
            }}
            renderItem={renderNotification}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </LinearGradient>
  );
}
