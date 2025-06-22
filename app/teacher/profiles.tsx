import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit3 } from 'lucide-react-native';

// Sample child data - in a real app, this would come from your database
const childrenData = [
  {
    id: 1,
    name: 'Emma Johnson',
    age: 8,
    gender: 'girl',
    profileImage: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=400',
    grade: '3rd Grade',
    school: 'Sunshine Elementary'
  },
  {
    id: 2,
    name: 'Lucas Martinez',
    age: 10,
    gender: 'boy',
    profileImage: 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=400',
    grade: '5th Grade',
    school: 'Riverside Elementary'
  },
  {
    id: 3,
    name: 'Sophia Chen',
    age: 6,
    gender: 'girl',
    profileImage: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=400',
    grade: '1st Grade',
    school: 'Meadowbrook Elementary'
  },
  {
    id: 4,
    name: 'Oliver Thompson',
    age: 12,
    gender: 'boy',
    profileImage: 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=400',
    grade: '7th Grade',
    school: 'Lincoln Middle School'
  }
];

export default function ChildProfiles() {
  const router = useRouter();

  const getGenderColors = (gender: string) => {
    return gender === 'girl' 
      ? { primary: '#ec4899', secondary: '#fce7f3', accent: '#be185d' }
      : { primary: '#3b82f6', secondary: '#dbeafe', accent: '#1d4ed8' };
  };

  const handleChildPress = (childId: number) => {
    // Navigate to individual child profile
    console.log('Navigate to child profile:', childId);
  };

  const handleAddChild = () => {
    // Navigate to add child form
    console.log('Navigate to add child form');
  };

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
          <Text style={styles.title}>My Children</Text>
          <TouchableOpacity 
            onPress={handleAddChild}
            style={styles.addButton}
          >
            <Plus size={24} color="#8b5cf6" />
          </TouchableOpacity>
        </View>

        {/* Children List */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {childrenData.map((child) => {
            const colors = getGenderColors(child.gender);
            
            return (
              <TouchableOpacity
                key={child.id}
                style={styles.childCard}
                onPress={() => handleChildPress(child.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  {/* Profile Image with Gender Border */}
                  <View style={[styles.imageContainer, { borderColor: colors.primary }]}>
                    <Image 
                      source={{ uri: child.profileImage }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                    {/* Gender Indicator */}
                    <View style={[styles.genderIndicator, { backgroundColor: colors.primary }]}>
                      <Text style={styles.genderText}>
                        {child.gender === 'girl' ? '♀' : '♂'}
                      </Text>
                    </View>
                  </View>

                  {/* Child Information */}
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <Text style={styles.childAge}>Age {child.age}</Text>
                    <View style={[styles.gradeTag, { backgroundColor: colors.secondary }]}>
                      <Text style={[styles.gradeText, { color: colors.accent }]}>
                        {child.grade}
                      </Text>
                    </View>
                    <Text style={styles.schoolName}>{child.school}</Text>
                  </View>

                  {/* Edit Button */}
                  <TouchableOpacity 
                    style={[styles.editButton, { backgroundColor: colors.secondary }]}
                    onPress={() => console.log('Edit child:', child.id)}
                  >
                    <Edit3 size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                {/* Decorative Bottom Border */}
                <View style={[styles.bottomBorder, { backgroundColor: colors.primary }]} />
              </TouchableOpacity>
            );
          })}

          {/* Add New Child Card */}
          <TouchableOpacity
            style={styles.addChildCard}
            onPress={handleAddChild}
            activeOpacity={0.8}
          >
            <View style={styles.addChildContent}>
              <View style={styles.addIconContainer}>
                <Plus size={32} color="#8b5cf6" strokeWidth={2} />
              </View>
              <Text style={styles.addChildText}>Add New Child</Text>
              <Text style={styles.addChildSubtext}>
                Create a profile for another child
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
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
    justifyContent: 'space-between',
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  childCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    borderWidth: 3,
    borderRadius: 35,
    padding: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  genderIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  genderText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  childInfo: {
    flex: 1,
    marginLeft: 16,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  childAge: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  gradeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  schoolName: {
    fontSize: 12,
    color: '#9ca3af',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBorder: {
    height: 4,
    width: '100%',
  },
  addChildCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  addChildContent: {
    padding: 32,
    alignItems: 'center',
  },
  addIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  addChildText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  addChildSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});