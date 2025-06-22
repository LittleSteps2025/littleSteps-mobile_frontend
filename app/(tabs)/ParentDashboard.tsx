// app/(tabs)/dashboard.tsx
import { View, Text, FlatList, Image, Pressable, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Bell } from 'lucide-react-native'
import {mockAlerts } from '@/data/mockData';

const { width } = Dimensions.get('window');

const children = [
  {
    id: '1',
    name: 'Pramodi Peshila',
    age: '5 years old',
    image: require('../../assets/images/kid1.jpg'),
    status: 'Active',
    // lastUpdate: '2 hours ago',
  },
  {
    id: '2',
    name: 'Nimal Perera',
    age: '7 years old',
    image: require('../../assets/images/kid1.jpg'),
    status: 'Active',
    // lastUpdate: '1 hour ago',
  },
];


export default function ParentDashboard() {
  const [alerts] = useState(mockAlerts);
  const unreadAlerts = alerts.filter((alert: { isRead: any; }) => !alert.isRead).length;

  const router = useRouter();

  const renderChild = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(tabs)/ParentDashboard',
          params: { id: item.id, name: item.name },
        })
      }
      className="mb-6 mx-4"
      style={{
        shadowColor: '#581c87',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
        start={[0, 0]}
        end={[1, 1]}
        className="rounded-3xl p-6 border border-white/30"
      >
        <View className="flex-row items-center">
          {/* Profile Image with Gradient Border */}
          <View className="relative">
            <LinearGradient
              colors={['#7c3aed', '#a855f7', '#c084fc']}
              start={[0, 0]}
              end={[1, 1]}
              className="w-20 h-20 rounded-full items-center justify-center"
            >
              <Image
                source={item.image}
                className="w-16 h-16 rounded-full"
                style={{ borderWidth: 2, borderColor: 'white' }}
              />
            </LinearGradient>

            {/* Status Indicator */}
            <View className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white items-center justify-center">
              <View className="w-2 h-2 bg-green-600 rounded-full" />
            </View>
          </View>

          {/* Child Info */}
          <View className="flex-1 ml-4">
            <Text className="text-xl font-bold text-gray-800 mb-1">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-600 mb-2">
              {item.age}
            </Text>

            {/* Status Row */}
            <View className="flex-row items-center">
              <View className="flex-row items-center bg-green-100 px-3 py-1 rounded-full">
                <Ionicons name="checkmark-circle" size={12} color="#16a34a" />
                <Text className="text-xs text-green-700 ml-1 font-medium">
                  {item.status}
                </Text>
              </View>
              {/* <Text className="text-xs text-gray-500 ml-2">
                Updated {item.lastUpdate}
              </Text> */}
            </View>
          </View>

          {/* Arrow Icon */}
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/Child_Details',
                params: {
                  id: item.id,
                  name: item.name,
                  age: item.age,
                  status: item.status,
                  lastUpdate: item.lastUpdate
                },
              })
            }
          >
            <LinearGradient
              colors={['#7c3aed', '#a855f7']}
              start={[0, 0]}
              end={[1, 1]}
              className="w-12 h-12 rounded-full items-center justify-center"
            >
              <Ionicons name="chevron-forward" size={20} color="white" />
            </LinearGradient>
          </Pressable>
        </View>

        {/* Quick Stats */}
        {/* <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-200">
          <View className="items-center flex-1">
            <Text className="text-lg font-bold text-purple-600">12</Text>
            <Text className="text-xs text-gray-600">Milestones</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-lg font-bold text-purple-600">8</Text>
            <Text className="text-xs text-gray-600">Activities</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-lg font-bold text-purple-600">95%</Text>
            <Text className="text-xs text-gray-600">Progress</Text>
          </View>
        </View> */}
      </LinearGradient>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={['#DFC1FD', '#f3e8ff', '#F5ECFE', '#F5ECFE', '#e9d5ff', '#DFC1FD']}
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
              Welcome Back! 👋
            </Text>
            <Text className="text-gray-600 text-base mt-1">
              Track your children's progress
            </Text>
          </View>

          <TouchableOpacity className='relative p-8'>
            <Bell size={24} color="#6B7280" />
            {unreadAlerts > 0 && (
              <View style={{
                position: 'absolute',
                top: 15,
                right: 15,
                backgroundColor: '#DC2626',
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: '600'
                }}>{unreadAlerts}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View className="flex-row justify-between">
          <LinearGradient
            colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
            start={[0, 0]}
            end={[1, 1]}
            className="flex-1 p-4 rounded-2xl mr-2"
          >
            <Text className="text-gray-600 text-xs">Total Children</Text>
            <Text className="text-gray-800 text-2xl font-bold">{children.length}</Text>
          </LinearGradient>

          <LinearGradient
            colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
            start={[0, 0]}
            end={[1, 1]}
            className="flex-1 p-4 rounded-2xl ml-2"
          >
            <Text className="text-gray-600 text-xs">Active Today</Text>
            <Text className="text-gray-800 text-2xl font-bold">{children.length}</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Children List */}
      <View className="flex-1 bg-gray-50 rounded-t-[30px] pt-6">
        <View className="flex-row items-center justify-between px-6 mb-4">
          <Text className="text-xl font-bold text-gray-800">
            Your Children
          </Text>
          {/* <Pressable className="flex-row items-center">
            <Text className="text-purple-700 font-medium mr-1">View All</Text>
            <Ionicons name="chevron-forward" size={16} color="#7c3aed" />
          </Pressable> */}
        </View>

        <FlatList
          data={children}
          keyExtractor={(item) => item.id}
          renderItem={renderChild}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        />
      </View>

      {/* Bottom Navigation */}
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
          {/* Home */}
          <Pressable className="items-center justify-center py-2">
            <View className="w-12 h-12 items-center justify-center">
              <Ionicons name="home" size={24} color="#7c3aed" />
            </View>
            <Text className="text-xs text-purple-600 font-medium mt-1">Home</Text>
          </Pressable>

          {/* Profile */}
          <Pressable className="items-center justify-center py-2">
            <View className="w-12 h-12 items-center justify-center">
              <Ionicons name="person" size={24} color="#9ca3af" />
            </View>
            <Text className="text-xs text-gray-500 mt-1">Profile</Text>
          </Pressable>

          {/* More */}
          <Pressable className="items-center justify-center py-2">
            <View className="w-12 h-12 items-center justify-center">
              <Ionicons name="ellipsis-horizontal" size={24} color="#9ca3af" />
            </View>
            <Text className="text-xs text-gray-500 mt-1">More</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}