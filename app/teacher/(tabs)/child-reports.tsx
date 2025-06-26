import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FileText, ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function Children() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);



  
  useEffect(() => {
    const fetchReports = async () => {
      try {
const response = await fetch("http://localhost:5001/api/reports");
        const data = await response.json();
        setChildren(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8B5CF6", "#EC4899"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Today child reports</Text>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#8B5CF6" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {children.map((child: any) => (
            <View key={child.child_id} style={styles.childCard}>
              <View style={styles.childHeader}>
                <Image
                  source={{ uri: child.avatar || "https://via.placeholder.com/60" }}
                  style={styles.avatar}
                />
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.child_name}</Text>
                  <Text style={styles.childDetails}>
                    {child.child_age} years old • {child.child_group} Group
                  </Text>
                </View>
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    {child.progress || 0}%
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${child.progress || 0}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.todaySection}>
                <Text style={styles.todaySectionTitle}>Today's Record</Text>
                <TouchableOpacity
                  style={styles.todayDetailsButton}
                  onPress={() =>
                    router.push(`/teacher/daily-report-form?childId=${child.childId}`)

                  }
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { paddingTop: 60, paddingBottom: 32, paddingHorizontal: 24 },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  content: { flex: 1, paddingHorizontal: 24, marginTop: -16 },
  childCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  childHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  childInfo: { flex: 1 },
  childName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  childDetails: { fontSize: 14, color: "#6B7280" },
  progressContainer: { alignItems: "flex-end" },
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
  todayDetailsText: { flex: 1, marginLeft: 12 },
  todayDetailsTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 2,
  },
  todayDetailsSubtitle: { fontSize: 14, color: "#6B7280" },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
});
