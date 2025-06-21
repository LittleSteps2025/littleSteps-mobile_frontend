import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, CalendarPlus } from 'lucide-react-native';

export default function Events() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#DFC1FD','#f3e8ff', '#F5ECFE','#F5ECFE','#e9d5ff', '#DFC1FD']}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>Events</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Calendar size={80} color="#9333ea" strokeWidth={1.5} />
          </View>
          
          <Text style={styles.mainText}>Upcoming Activities</Text>
          <Text style={styles.subText}>
            Keep track of important dates, activities, and events for your children. Never miss a special moment or deadline.
          </Text>

          <TouchableOpacity style={styles.eventButton}>
            <CalendarPlus size={20} color="white" strokeWidth={2} />
            <Text style={styles.eventButtonText}>View Calendar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    marginTop: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
  subText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  eventButton: {
    flexDirection: 'row',
    backgroundColor: '#9333ea',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#9333ea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  eventButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});