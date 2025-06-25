import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Clock,
  Coffee,
  Utensils,
  Heart,
  Droplets,
  Pill,
  Moon,
  Baby,
  Smile,
  CircleAlert as AlertCircle,
  Save,
  Send,
  ArrowLeft,
  CheckCheckIcon,
  CheckIcon,
  CheckCircle,
  Check,
} from 'lucide-react-native';

interface ReportField {
  id: string;
  title: string;
  icon: any;
  time: string;
  description: string;
  completed: boolean;
  required: boolean;
  color: string;
}

export default function DailyReportForm() {
  const [childName] = useState('Ishadi Thashmika');
  const [reportDate] = useState(new Date().toLocaleDateString());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [reportFields, setReportFields] = useState<ReportField[]>([
    { id: 'arrival', title: 'Arrival', icon:Check, time: '', description: '', completed: false, required: true, color: '#10B981' },
    { id: 'breakfast', title: 'Breakfast', icon: Coffee, time: '', description: '', completed: false, required: true, color: '#F59E0B' },
    { id: 'morning_snack', title: 'Morning Snack', icon: Utensils, time: '', description: '', completed: false, required: false, color: '#8B5CF6' },
    { id: 'lunch', title: 'Lunch', icon: Utensils, time: '', description: '', completed: false, required: true, color: '#EF4444' },
    { id: 'afternoon_snack', title: 'Afternoon Snack', icon: Coffee, time: '', description: '', completed: false, required: false, color: '#06B6D4' },
    { id: 'nap_time', title: 'Nap Time', icon: Moon, time: '', description: '', completed: false, required: true, color: '#6366F1' },
    { id: 'diaper_change', title: 'Diaper Changes', icon: Baby, time: '', description: '', completed: false, required: true, color: '#EC4899' },
    { id: 'drinks', title: 'Drinks & Fluids', icon: Droplets, time: '', description: '', completed: false, required: true, color: '#14B8A6' },
    { id: 'medicines', title: 'Medicines', icon: Pill, time: '', description: '', completed: false, required: false, color: '#F97316' },
    { id: 'activities', title: 'Activities & Play', icon: Heart, time: '', description: '', completed: false, required: true, color: '#84CC16' },
  ]);

  const [specialNotes, setSpecialNotes] = useState('');
  const [emergencyNotes, setEmergencyNotes] = useState('');

  useEffect(() => {
    const autoSave = setInterval(() => {
      saveProgress();
    }, 30000);
    return () => clearInterval(autoSave);
  }, [reportFields, specialNotes, emergencyNotes]);

  const updateField = (id: string, field: 'time' | 'description', value: string) => {
    setReportFields(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const toggleComplete = (id: string) => {
    setReportFields(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const saveProgress = () => {
    setLastSaved(new Date());
    console.log('Progress saved automatically');
  };

  const validateForm = () => {
    const incompleteRequired = reportFields.filter(field => field.required && !field.completed);
    if (incompleteRequired.length > 0) {
      Alert.alert(
        'Incomplete Required Fields',
        `Please complete the following required fields:\n${incompleteRequired.map(f => f.title).join('\n')}`,
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    Alert.alert(
      'Submit Daily Report',
      'Are you sure you want to submit this report? Once submitted, it cannot be edited.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          style: 'default',
          onPress: () => {
            setIsSubmitted(true);
            Alert.alert(
              'Report Submitted',
              'Daily report has been successfully submitted to parents.',
              [{ text: 'OK', onPress: () => router.back() }]
            );
          },
        },
      ]
    );
  };

  const getCompletionPercentage = () => {
    const completed = reportFields.filter(field => field.completed).length;
    return Math.round((completed / reportFields.length) * 100);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Daily Report</Text>
            <Text style={styles.headerSubtitle}>{childName}</Text>
            <Text style={styles.headerDate}>{reportDate}</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>Progress: {getCompletionPercentage()}% Complete</Text>
            {lastSaved && (
              <Text style={styles.savedText}>Last saved: {lastSaved.toLocaleTimeString()}</Text>
            )}
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getCompletionPercentage()}%` }]} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {reportFields.map((field) => (
          <View key={field.id} style={styles.fieldCard}>
            <View style={styles.fieldHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${field.color}20` }]}>
                <field.icon size={20} color={field.color} strokeWidth={2} />
              </View>
              <View style={styles.fieldTitleContainer}>
                <Text style={styles.fieldTitle}>{field.title}</Text>
                {field.required && <Text style={styles.requiredText}>*Required</Text>}
              </View>
              <Switch
                value={field.completed}
                onValueChange={() => toggleComplete(field.id)}
                disabled={isSubmitted}
                trackColor={{ false: '#E5E7EB', true: field.color }}
                thumbColor={field.completed ? field.color : '#f4f3f4'}
              />
            </View>

            <View style={styles.timeInputContainer}>
              <Clock size={16} color="#6B7280" strokeWidth={2} />
              <TextInput
                style={styles.timeInput}
                placeholder="Enter time (e.g., 9:30 AM)"
                value={field.time}
                onChangeText={(text) => updateField(field.id, 'time', text)}
                editable={!isSubmitted}
              />
              <TouchableOpacity
                style={styles.nowButton}
                onPress={() => updateField(field.id, 'time', getCurrentTime())}
                disabled={isSubmitted}>
                <Text style={styles.nowButtonText}>Now</Text>
              </TouchableOpacity>
            </View>

           
          </View>
        ))}

        {/* Special Notes Section */}
        <View style={styles.notesCard}>
          <View style={styles.notesHeader}>
            <Heart size={20} color="#EC4899" strokeWidth={2} />
            <Text style={styles.notesTitle}>Special Notes</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            placeholder="Any special observations, achievements, or notes about the child's day..."
            value={specialNotes}
            onChangeText={setSpecialNotes}
            multiline
            numberOfLines={4}
            editable={!isSubmitted}
          />
        </View>

  

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveProgress}
            disabled={isSubmitted}>
            <Save size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.saveButtonText}>Save Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitted && styles.submittedButton]}
            onPress={handleSubmit}
            disabled={isSubmitted}>
            <Send size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.submitButtonText}>
              {isSubmitted ? 'Submitted' : 'Submit Report'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

// (keep your StyleSheet unchanged – already included in your original code)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  headerDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  savedText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -12,
  },
  fieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldTitleContainer: {
    flex: 1,
  },
  fieldTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  requiredText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  timeInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  nowButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  nowButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  emergencyCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  emergencyInput: {
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B7280',
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
  },
  submittedButton: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 32,
  },
});