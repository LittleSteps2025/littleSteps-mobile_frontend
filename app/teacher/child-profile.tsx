import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  Pill, 
  Shield,
  FileText,
  Eye
} from 'lucide-react-native';

// Extended child data with detailed information
const getChildDetails = (childId: string) => {
  const childrenDetails: { [key: string]: any } = {
    '1': {
      id: 1,
      name: 'Emma Johnson',
      age: 8,
      gender: 'girl',
      profileImage: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=400',
      grade: '3rd Grade',
      school: 'Sunshine Elementary',
      birthday: 'March 15, 2016',
      address: '123 Maple Street, Springfield, IL 62701',
      mother: {
        name: 'Sarah Johnson',
        phone: '+1 (555) 123-4567',
        email: 'sarah.johnson@email.com',
        workplace: 'Springfield General Hospital'
      },
      father: {
        name: 'Michael Johnson',
        phone: '+1 (555) 987-6543',
        email: 'michael.johnson@email.com',
        workplace: 'Tech Solutions Inc.'
      },
      allergies: ['Peanuts', 'Shellfish', 'Pollen'],
      medicines: ['Albuterol Inhaler (as needed)', 'Children\'s Claritin (daily)'],
      emergencyContact: {
        name: 'Grandma Rose',
        phone: '+1 (555) 456-7890',
        relation: 'Grandmother'
      }
    },
    '2': {
      id: 2,
      name: 'Lucas Martinez',
      age: 10,
      gender: 'boy',
      profileImage: 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=400',
      grade: '5th Grade',
      school: 'Riverside Elementary',
      birthday: 'July 22, 2014',
      address: '456 Oak Avenue, Springfield, IL 62702',
      mother: {
        name: 'Maria Martinez',
        phone: '+1 (555) 234-5678',
        email: 'maria.martinez@email.com',
        workplace: 'Springfield Elementary School'
      },
      father: {
        name: 'Carlos Martinez',
        phone: '+1 (555) 876-5432',
        email: 'carlos.martinez@email.com',
        workplace: 'Martinez Construction'
      },
      allergies: ['None known'],
      medicines: ['Multivitamin (daily)'],
      emergencyContact: {
        name: 'Uncle Roberto',
        phone: '+1 (555) 567-8901',
        relation: 'Uncle'
      }
    }
  };
  
  return childrenDetails[childId] || null;
};

export default function ChildProfile() {
  const router = useRouter();
  const { childId, childData } = useLocalSearchParams();
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  
  // Get detailed child information
  const child = getChildDetails(childId as string);
  
  if (!child) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Child not found</Text>
      </View>
    );
  }

  const getGenderColors = (gender: string) => {
    return gender === 'girl' 
      ? { primary: '#ec4899', secondary: '#fce7f3', accent: '#be185d', light: '#fdf2f8' }
      : { primary: '#3b82f6', secondary: '#dbeafe', accent: '#1d4ed8', light: '#eff6ff' };
  };

  const colors = getGenderColors(child.gender);

  const handleViewSensitiveData = () => {
    Alert.alert(
      'Access Sensitive Information',
      'Are you sure you want to view details?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setShowSensitiveData(true);
            // In a real app, you would notify the parent here
            Alert.alert(
              'Parent Notified',
              'The parent has been notified that sensitive information was accessed.',
              [{ text: 'OK' }]
            );
          },
        },
      ],
      { 
        cancelable: true,
        userInterfaceStyle: 'light'
      }
    );
  };

  const InfoCard = ({ icon: Icon, title, content, iconColor }: any) => (
    <View style={styles.infoCard}>
      <View style={[styles.iconContainer, { backgroundColor: colors.light }]}>
        <Icon size={20} color={iconColor || colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoText}>{content}</Text>
      </View>
    </View>
  );

  const SensitiveDocument = ({ title, type, date }: any) => (
    <View style={styles.documentCard}>
      <View style={styles.documentIcon}>
        <FileText size={24} color={colors.primary} />
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle}>{title}</Text>
        <Text style={styles.documentType}>{type}</Text>
        <Text style={styles.documentDate}>{date}</Text>
      </View>
      <TouchableOpacity style={[styles.viewButton, { backgroundColor: colors.secondary }]}>
        <Eye size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

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
          <Text style={styles.title}>Child Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={[styles.profileImageContainer, { borderColor: colors.primary }]}>
              <Image 
                source={{ uri: child.profileImage }}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <View style={[styles.genderBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.genderText}>
                  {child.gender === 'girl' ? '♀' : '♂'}
                </Text>
              </View>
            </View>
            <Text style={styles.childName}>{child.name}</Text>
            <Text style={styles.childAge}>Age {child.age}</Text>
            <View style={[styles.gradeTag, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.gradeText, { color: colors.accent }]}>
                {child.grade}
              </Text>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <InfoCard 
              icon={Calendar}
              title="Birthday"
              content={child.birthday}
            />
            
            <InfoCard 
              icon={MapPin}
              title="Address"
              content={child.address}
            />
          </View>

          {/* Parents Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Parents Information</Text>
            
            <View style={styles.parentCard}>
              <Text style={styles.parentTitle}>Mother</Text>
              <Text style={styles.parentName}>{child.mother.name}</Text>
              <View style={styles.contactRow}>
                <Phone size={16} color="#6b7280" />
                <Text style={styles.contactText}>{child.mother.phone}</Text>
              </View>
              <View style={styles.contactRow}>
                <Mail size={16} color="#6b7280" />
                <Text style={styles.contactText}>{child.mother.email}</Text>
              </View>
              <Text style={styles.workplaceText}>Works at: {child.mother.workplace}</Text>
            </View>

            <View style={styles.parentCard}>
              <Text style={styles.parentTitle}>Father</Text>
              <Text style={styles.parentName}>{child.father.name}</Text>
              <View style={styles.contactRow}>
                <Phone size={16} color="#6b7280" />
                <Text style={styles.contactText}>{child.father.phone}</Text>
              </View>
              <View style={styles.contactRow}>
                <Mail size={16} color="#6b7280" />
                <Text style={styles.contactText}>{child.father.email}</Text>
              </View>
              <Text style={styles.workplaceText}>Works at: {child.father.workplace}</Text>
            </View>
          </View>

          {/* Health Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Information</Text>
            
            <View style={styles.healthCard}>
              <View style={styles.healthHeader}>
                <Heart size={20} color="#ef4444" />
                <Text style={styles.healthTitle}>Allergies</Text>
              </View>
              {child.allergies.map((allergy: string, index: number) => (
                <Text key={index} style={styles.healthItem}>• {allergy}</Text>
              ))}
            </View>

            <View style={styles.healthCard}>
              <View style={styles.healthHeader}>
                <Pill size={20} color="#10b981" />
                <Text style={styles.healthTitle}>Current Medications</Text>
              </View>
              {child.medicines.map((medicine: string, index: number) => (
                <Text key={index} style={styles.healthItem}>• {medicine}</Text>
              ))}
            </View>
          </View>

          {/* Sensitive Data Access */}
          {!showSensitiveData ? (
            <View style={styles.section}>
              <TouchableOpacity 
                style={[styles.sensitiveButton, { backgroundColor: colors.primary }]}
                onPress={handleViewSensitiveData}
              >
                <Shield size={20} color="white" />
                <Text style={styles.sensitiveButtonText}>View More Details</Text>
              </TouchableOpacity>
              <Text style={styles.sensitiveWarning}>
                This contains sensitive data. Once you click yes, parent will be notified.
              </Text>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sensitive Documents</Text>
              <Text style={styles.accessGrantedText}>Access granted - Parent has been notified</Text>
              
              <SensitiveDocument 
                title="Birth Certificate"
                type="Official Document"
                date="Issued: March 15, 2016"
              />
              
              <SensitiveDocument 
                title="Medical Records"
                type="Health Document"
                date="Last updated: January 2024"
              />
              
              <SensitiveDocument 
                title="Vaccination Records"
                type="Health Document"
                date="Last updated: September 2023"
              />
              
              <SensitiveDocument 
                title="School Enrollment"
                type="Educational Document"
                date="Academic Year 2023-2024"
              />
              
              <SensitiveDocument 
                title="Emergency Medical Info"
                type="Health Document"
                date="Last updated: August 2023"
              />
            </View>
          )}

          {/* Emergency Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            <View style={styles.emergencyCard}>
              <Text style={styles.emergencyName}>{child.emergencyContact.name}</Text>
              <Text style={styles.emergencyRelation}>{child.emergencyContact.relation}</Text>
              <View style={styles.contactRow}>
                <Phone size={16} color="#ef4444" />
                <Text style={[styles.contactText, { color: '#ef4444' }]}>
                  {child.emergencyContact.phone}
                </Text>
              </View>
            </View>
          </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    position: 'relative',
    borderWidth: 4,
    borderRadius: 60,
    padding: 4,
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  genderBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  genderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  childName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  childAge: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 12,
  },
  gradeTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 22,
  },
  parentCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  parentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  parentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  workplaceText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  healthCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  healthItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 20,
  },
  sensitiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  sensitiveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sensitiveWarning: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  accessGrantedText: {
    fontSize: 14,
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  documentCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  documentType: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyCard: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  emergencyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 4,
  },
  emergencyRelation: {
    fontSize: 14,
    color: '#7f1d1d',
    marginBottom: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
  },
});