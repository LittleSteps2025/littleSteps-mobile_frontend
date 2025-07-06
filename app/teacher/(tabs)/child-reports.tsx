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
import { API_BASE_URL } from "../../../utility/config";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Children() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reports`);
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
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[
          "#DFC1FD",
          "#f3e8ff",
          "#F5ECFE",
          "#F5ECFE",
          "#e9d5ff",
          "#DFC1FD",
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Today child reports</Text>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#8B5CF6"
              style={{ marginTop: 20 }}
            />
          ) : (
            <View style={styles.content}>
            {Array.isArray(children) &&
  children.map((child: any) => (
                <View key={child.child_id} style={styles.childCard}>
                  <View style={styles.childHeader}>
                    <Image
                      source={{
                        uri: child.avatar || "https://via.placeholder.com/60",
                      }}
                      style={styles.avatar}
                    />
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.child_name}</Text>
                      <Text style={styles.childDetails}>
                        {child.child_age} years old • {child.child_group} Group
                      </Text>
                    </View>
                    <View style={styles.progressContainer}>
                      <Text style={styles.progressText}>{child.progress}%</Text>
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
                        router.push(
                          `/teacher/daily-report-form?report_id=${child.report_id}`
                        )
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
            </View>
          )}
        </View>
      </LinearGradient>{" "}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3e8ff" },
  header: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
  },
  content: { flex: 1, paddingHorizontal: 24, marginTop: 20 },
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
  },
});
