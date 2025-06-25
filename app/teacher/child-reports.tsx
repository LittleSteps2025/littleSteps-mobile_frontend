import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Plus,
  User,
  BookOpen,
  Trophy,
  Clock,
  FileText,
} from "lucide-react-native";
import { router } from "expo-router";
import { useState } from "react";

export default function Children() {
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const children = [
    {
      id: 1,
      name: "Emma Johnson",
      age: 8,
      grade: "Grade 3",
      avatar:
        "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg",
      courses: 4,
      achievements: 12,
      studyTime: "15h",
      progress: 85,
    },
    {
      id: 2,
      name: "Liam Johnson",
      age: 6,
      grade: "Grade 1",
      avatar:
        "https://images.pexels.com/photos/1620653/pexels-photo-1620653.jpeg",
      courses: 3,
      achievements: 8,
      studyTime: "10h",
      progress: 92,
    },
    {
      id: 3,
      name: "Ishadi Thashmika",
      age: 2,
      grade: "Toddler",
      avatar:
        "https://images.pexels.com/photos/1104007/pexels-photo-1104007.jpeg",
      courses: 2,
      achievements: 5,
      studyTime: "8h",
      progress: 78,
    },
  ];

  // Mock todo items for the selected child
  const mockTodoItems = [
    {
      id: "arrival",
      title: "Arrival & Morning Check-in",
      icon: null,
      time: "8:30 AM",
      description: "Arrived happy and excited for the day",
      completed: true,
      color: "#10B981",
    },
    {
      id: "breakfast",
      title: "Breakfast",
      icon: null,
      time: "9:00 AM",
      description: "Ate cereal and banana, drank milk",
      completed: true,
      color: "#F59E0B",
    },
    {
      id: "lunch",
      title: "Lunch",
      icon: null,
      time: "",
      description: "",
      completed: false,
      color: "#EF4444",
    },
    {
      id: "nap_time",
      title: "Nap Time",
      icon: null,
      time: "",
      description: "",
      completed: false,
      color: "#6366F1",
    },
  ];

  const handleViewTodayDetails = (child: any) => {
    setSelectedChild(child);
    setShowDetailsModal(true);
  };

  const handleStartReport = () => {
    setShowDetailsModal(false);
    router.push("/teacher/daily-report-form");
  };

  const handleStartReportDirect = (childId: number) => {
    router.push("/teacher/daily-report-form");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8B5CF6", "#EC4899"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Today child reports</Text>
        <Text style={styles.headerSubtitle}></Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {children.map((child) => (
          <View key={child.id} style={styles.childCard}>
            <View style={styles.childHeader}>
              <Image source={{ uri: child.avatar }} style={styles.avatar} />
              <View style={styles.childInfo}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childDetails}>
                  {child.age} years old • {child.grade}
                </Text>
              </View>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>{child.progress}%</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${child.progress}%` },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Today's Record Section */}
            <View style={styles.todaySection}>
              <Text style={styles.todaySectionTitle}>Today's Record</Text>
              <TouchableOpacity
                style={styles.todayDetailsButton}
                onPress={() => router.push("/teacher/daily-report-form")}
                activeOpacity={0.8}
              >
                <FileText size={20} color="#8B5CF6" strokeWidth={2} />
                <View style={styles.todayDetailsText}>
                  <Text style={styles.todayDetailsTitle}>
                    View Today's Details
                  </Text>
                  <Text style={styles.todayDetailsSubtitle}>
                    Check progress and activities
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Child Details Modal */}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -16,
  },
  childCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  childHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  childDetails: {
    fontSize: 14,
    color: "#6B7280",
  },
  progressContainer: {
    alignItems: "flex-end",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5CF6",
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  todaySection: {
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  todaySectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  todayDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  todayDetailsText: {
    flex: 1,
    marginLeft: 12,
  },
  todayDetailsTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 2,
  },
  todayDetailsSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  viewProfileButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#8B5CF6",
  },
  viewProfileText: {
    color: "#8B5CF6",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  startReportButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 12,
  },
  startReportText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  addChildCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  addChildContent: {
    alignItems: "center",
  },
  addIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  addChildText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  addChildSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
