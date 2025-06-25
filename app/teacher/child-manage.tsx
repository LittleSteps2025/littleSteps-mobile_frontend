import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, Clock, Users } from 'lucide-react-native';

export default function Dashboard() {
  const router = useRouter();

  const navigationCards = [
    {
      id: 1,
      title: 'View Reports',
      subtitle: 'Access performance reports',
      icon: FileText,
      route: '/teacher/child-reports',
      color: '#10b981',
    },
    {
      id: 2,
      title: 'Attendance',
      subtitle: 'View children attendance',
      icon: Clock,
      route: '/teacher/attendance',
      color: '#3b82f6',
    },
    {
      id: 3,
      title: 'All Children',
      subtitle: 'Browse all profiles',
      icon: Users,
      route: '/teacher/profiles',
      color: '#6366f1',
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>What would you like to explore today?</Text>
        </View>

        <View style={styles.cardsContainer}>
          {navigationCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <TouchableOpacity
                key={card.id}
                style={[styles.card, { marginBottom: 20 }]}
                onPress={() => handleNavigation(card.route)}
                activeOpacity={0.85}
              >
                <View style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: card.color }]}>
                    <IconComponent color="#fff" size={28} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>›</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: 28,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 40,
  },
});
