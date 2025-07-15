import { AuthGuard } from "@/components/AuthGuard";
import { useUser } from "@/contexts/UserContext";
import { mockAlerts } from "@/data/mockData";
import { API_BASE_URL } from "@/utility";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ParentDashboard() {
  const { user, updateChildren } = useUser();
  const [alerts] = useState(mockAlerts);
  const [childrenData, setChildrenData] = useState<any[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  // Debug: Show what's in session storage
  useEffect(() => {
    if (user) {
      console.log("🔍 CURRENT SESSION DATA:");
      console.log("User ID:", user.id);
      console.log("User Name:", user.fullName);
      console.log("User Email:", user.email);
      console.log("User Role:", user.role);
      console.log("Children in session:", user.children?.length || 0);
      console.log(user);
    }
  }, [user]);

  // Fetch children data when user is available
  useEffect(() => {
    const fetchChildrenData = async () => {
      if (!user?.id) {
        setIsLoadingChildren(false);
        return;
      }
      if (user.children && user.children.length > 0) {
        const sessionChildren = user.children.map((child: any) => ({
          id: child.id,
          name: child.name,
          age: `${child.age} years old`,
          image: child.profileImage || require("@/assets/images/kid1.jpg"),
          status: "Active",
          gender: child.gender || "male",
          dob: child.dob,
          blood_type: child.blood_type,
          class: child.class || "",
          allergies: child.allergies || [],
          emergencyContact: child.emergencyContact || "",
        }));
        setChildrenData(sessionChildren);
        setIsLoadingChildren(false);
        return;
      }
      try {
        const response = await fetch(
          `${API_BASE_URL}/children/details/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...((await getAuthToken()) && {
                Authorization: `Bearer ${await getAuthToken()}`,
              }),
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const childrenList = data.children || data.data || data || [];
          const transformedChildren = childrenList.map((child: any) => ({
            id: child.id?.toString() || child.childId?.toString() || "",
            name: child.name || child.fullName || child.childName || "",
            age: child.age || calculateAge(child.dateOfBirth) || "",
            image:
              child.image ||
              child.profileImage ||
              child.profile_picture ||
              require("@/assets/images/kid1.jpg"),
            status: child.status || "Active",
            gender: child.gender || "male",
            dob: child.dob,
            blood_type: child.blood_type,
            class: child.class || child.className || "",
            allergies: child.allergies || [],
            emergencyContact: child.emergencyContact || "",
          }));
          setChildrenData(transformedChildren);
          await updateChildren(
            transformedChildren.map((child: any) => ({
              id: child.id,
              name: child.name,
              age:
                typeof child.age === "string" ? parseInt(child.age) : child.age,
              class: child.class || "",
              profileImage: child.image,
              dateOfBirth: child.dob,
              blood_type: child.blood_type,
              allergies: child.allergies,
              emergencyContact: child.emergencyContact,
              lastUpdated: new Date().toISOString(),
              apiData: data.children
                ? data.children.find((c: any) => c.id?.toString() === child.id)
                : null,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching children:", error);
      } finally {
        setIsLoadingChildren(false);
      }
    };
    fetchChildrenData();
  }, [user?.id, user?.children, updateChildren]);

  // Helper function to get auth token
  const getAuthToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      return null;
    }
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return "";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    return `${age} years old`;
  };

  // Fetch unread announcement count and update when focused
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/announcements/parent`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        const count = Array.isArray(data)
          ? data.filter((item: any) => !item.isRead).length
          : 0;
        setUnreadCount(count);
      } catch (err) {
        setUnreadCount(0);
      }
    };
    fetchUnreadCount();
    // Optionally, add focus listener if needed for your router
    // Example for Expo Router:
    // const unsubscribe = router.addListener?.('focus', fetchUnreadCount);
    // return () => { if (unsubscribe) unsubscribe(); };
  }, [router]);

  const userChildren = childrenData;

  const renderChild = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(tabs)/ParentDashboard",
          params: { id: item.id, name: item.name },
        })
      }
      className="mb-6 mx-4"
      style={{
        shadowColor: "#581c87",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View
        className="rounded-3xl border overflow-hidden"
        style={{
          borderBottomWidth: 4,
          borderBottomColor: item.gender === "female" ? "#ec4899" : "#3b82f6",
        }}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.85)"]}
          start={[0, 0]}
          end={[1, 1]}
          className="p-6"
        >
          <View className="flex-row items-center">
            {/* Profile Image without Background */}
            <View className="relative">
              <Image
                source={
                  typeof item.image === "string"
                    ? { uri: item.image }
                    : item.image
                }
                className="w-20 h-20 rounded-full"
                style={{
                  borderWidth: 3,
                  borderColor: item.gender === "female" ? "#ec4899" : "#3b82f6",
                }}
              />
              {/* Status Indicator */}
              <View className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white items-center justify-center ">
                <View className="w-2 h-2 bg-green-600 rounded-full" />
              </View>
            </View>
            {/* Child Info */}
            <View className="flex-1 ml-4">
              <Text className="text-xl font-bold text-gray-800 mb-2">
                {item.name}
              </Text>
              <Text className="text-sm text-gray-600 mb-2">{item.age}</Text>
              {/* Status Row */}
              <View className="flex-row items-center">
                <View className="flex-row items-center bg-green-100 px-3 py-1 rounded-full">
                  <Ionicons name="checkmark-circle" size={12} color="#16a34a" />
                  <Text className="text-xs text-green-700 ml-1 font-medium">
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
            {/* Arrow Icon */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/Child_Details",
                  params: {
                    id: item.id,
                    name: item.name,
                    age: item.age,
                    status: item.status,
                    gender: item.gender,
                  },
                })
              }
              className="ml-4"
            >
              <View className="bg-purple-500 rounded-full w-10 h-10  items-center justify-center ">
                <Ionicons name="chevron-forward" size={20} color="white" />
              </View>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );

  return (
    <AuthGuard requiredRole="parent">
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

        {/* Header */}
        <View className="pt-12 pb-6 px-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-gray-700 text-2xl font-bold">
                Welcome Back
                {user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}! 👋
              </Text>
              <Text className="text-gray-600 text-base mt-1">
                Track your children&apos;s progress
              </Text>
            </View>
            <TouchableOpacity className="relative p-8" onPress={() => router.push("/announcements")}>
              <Bell size={24} color="#6B7280" />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: 15,
                    right: 15,
                    backgroundColor: "#DC2626",
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          {/* Stats Cards */}
          <View className="flex-row justify-between">
            <LinearGradient
              colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,0.6)"]}
              start={[0, 0]}
              end={[1, 1]}
              className="flex-1 p-4 rounded-2xl mr-2"
            >
              <Text className="text-gray-600 text-xs">Total Children</Text>
              <Text className="text-gray-800 text-2xl font-bold">
                {userChildren.length}
              </Text>
            </LinearGradient>
            <LinearGradient
              colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,0.6)"]}
              start={[0, 0]}
              end={[1, 1]}
              className="flex-1 p-4 rounded-2xl ml-2"
            >
              <Text className="text-gray-600 text-xs">Active Today</Text>
              <Text className="text-gray-800 text-2xl font-bold">
                {
                  userChildren.filter((child) => child.status === "Active")
                    .length
                }
              </Text>
            </LinearGradient>
          </View>
        </View>
        {/* Children List */}
        <View className="flex-1 bg-gray-50 rounded-t-[30px] pt-6  ">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Your Children
            </Text>
          </View>
          <FlatList
            data={userChildren}
            keyExtractor={(item) => item.id}
            renderItem={renderChild}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center p-8">
                {isLoadingChildren ? (
                  <Text className="text-gray-600">Loading children...</Text>
                ) : (
                  <Text className="text-gray-600">No children found</Text>
                )}
              </View>
            )}
          />
        </View>
        {/* Bottom Navigation */}
        <View className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md">
          <View
            className="flex-row justify-around items-center py-4 px-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {/* Home */}
            <Pressable className="items-center justify-center py-2">
              <View className="w-12 h-12 items-center justify-center">
                <Ionicons name="home" size={24} color="#7c3aed" />
              </View>
              <Text className="text-xs text-purple-600 font-medium mt-1">
                Home
              </Text>
            </Pressable>
            {/* Profile */}
            <Pressable
              className="items-center justify-center py-2"
              onPress={() => router.push("/ParentProfile")}
            >
              <View className="w-12 h-12 items-center justify-center">
                <Ionicons name="person" size={24} color="#9ca3af" />
              </View>
              <Text className="text-xs text-gray-500 mt-1">Profile</Text>
            </Pressable>
            {/* More */}
            <Pressable
              className="items-center justify-center py-2"
              onPress={() => router.push("/ParentMore")}
            >
              <View className="w-12 h-12 items-center justify-center">
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color="#9ca3af"
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">More</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </AuthGuard>
  );
}