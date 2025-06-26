import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  StyleSheet,
  ActivityIndicator,
  Picker,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  Clock,
  Coffee,
  Utensils,
  Heart,
  Pill,
  Save,
  Send,
  ArrowLeft,
  Check,
  Calendar,
  User,
  LogOut,
  Users,
} from "lucide-react-native";

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
  const { childId } = useLocalSearchParams();
  const [childName, setChildName] = useState("");
  const [reportDate, setReportDate] = useState(new Date().toLocaleDateString());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const [reportFields, setReportFields] = useState<ReportField[]>([]);
  const [specialNotes, setSpecialNotes] = useState("");
  const [dailySummary, setDailySummary] = useState("");
  const [checkoutPerson, setCheckoutPerson] = useState("");
  const [checkoutTime, setCheckoutTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [arrivalCompleted, setArrivalCompleted] = useState(false);

  const [guardians, setGuardians] = useState<string[]>([]);

  const totalTasks = reportFields.length + 1;
  const completedTasks =
    reportFields.filter((field) => field.completed).length +
    (arrivalCompleted ? 1 : 0);
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  useEffect(() => {
    async function fetchGuardians() {
      try {
        const res = await fetch(
          `http://localhost:5001/api/guardians/${childId}`
        );
        const data = await res.json();
        setGuardians(data.map((g: any) => g.name));
      } catch (e) {
        console.error("Failed to fetch guardians", e);
      }
    }
    fetchGuardians();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/reports/${childId}`
        );
        const data = await response.json();
        const report = data[0];

        setChildName(report.child_name || "");
        setReportFields([
          {
            id: "breakfast",
            title: "Breakfast",
            icon: Coffee,
            time: report.breakfast_time || "",
            description: report.breakfast || "No breakfast details recorded",
            completed: !!report.breakfast,
            required: true,
            color: "#F59E0B",
          },
          {
            id: "tea_time",
            title: "Tea Time",
            icon: Coffee,
            time: report.tea_time_time || "",
            description: report.tea_time || "No tea time details recorded",
            completed: !!report.tea_time,
            required: false,
            color: "#D97706",
          },
          {
            id: "lunch",
            title: "Lunch",
            icon: Utensils,
            time: report.lunch_time || "",
            description: report.lunch || "No lunch details recorded",
            completed: !!report.lunch,
            required: true,
            color: "#EF4444",
          },
          {
            id: "snack_time",
            title: "Snack Time",
            icon: Coffee,
            time: report.snack_time_time || "",
            description: report.snack_time || "No snack time details recorded",
            completed: !!report.snack_time,
            required: false,
            color: "#06B6D4",
          },
          {
            id: "medicine",
            title: "Medicine",
            icon: Pill,
            time: report.medicine_time || "",
            description: report.medicine || "No medicine details recorded",
            completed: !!report.medicine,
            required: false,
            color: "#F97316",
          },
        ]);

        setSpecialNotes(report.special_notes || "");
        setDailySummary(report.day_summery || "");
        setCheckoutPerson(report.checkout_person || "");
        setCheckoutTime(report.checkout_time || "");
        setArrivalTime(report.arrived_time || "");
        setArrivalCompleted(!!report.arrived_time);
      } catch (error) {
        console.error("Failed to load report:", error);
      } finally {
        setLoading(false);
      }
    };

    if (childId) fetchReport();
  }, [childId]);

  const updateField = (
    id: string,
    field: "time" | "description",
    value: string
  ) => {
    setReportFields((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const toggleComplete = (id: string) => {
    setReportFields((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const saveArrivalTime = async () => {
    const now = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setArrivalTime(now);
    setArrivalCompleted(true);

    try {
      const response = await fetch(
        `http://localhost:5001/api/reports/${childId}/arrival`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ arrived_time: now }),
        }
      );

      if (response.ok) {
        Alert.alert("Arrival time saved", `Arrival time set to ${now}`);
      } else {
        throw new Error("Failed to update arrival time");
      }
    } catch (error) {
      console.error("Error saving arrival time:", error);
      Alert.alert("Error", "Failed to save arrival time to the server.");
    }
  };

  const saveProgress = async () => {
    setLastSaved(new Date());

    const statusUpdates: { [key: string]: number } = {};
    reportFields.forEach((field) => {
      statusUpdates[field.id] = field.completed ? 1 : 0;
    });

    try {
      const response = await fetch(
        `http://localhost:5001/api/reports/${childId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(statusUpdates),
        }
      );

      if (response.ok) {
        Alert.alert("Progress Saved", "Status fields have been saved.");
        router.back(); // Navigate back immediately after save
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error saving status fields:", error);
      Alert.alert("Error", "Failed to save progress.");
    }
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;

  const statusUpdates = {};
  reportFields.forEach((field) => {
    statusUpdates[field.id] = field.completed ? 1 : 0;
  });

  // Include checkout info and daily summary
  const payload = {
    statusUpdates,
    checkoutPerson,
    checkoutTime,
    progress: progressPercentage,
    dailySummary,      // Add daily summary here
  };

  try {
    const response = await fetch(
      `http://localhost:5001/api/reports/${childId}/submit`,
      {
        method: "PUT", // or POST depending on backend
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      Alert.alert("Progress Saved", "Status fields have been saved.");
      setIsSubmitted(true);
      router.back();
    } else {
      throw new Error("Failed to submit report");
    }
  } catch (error) {
    console.error("Submit error:", error);
    Alert.alert("Error", "Failed to submit report.");
  }
};


  const validateForm = () => {
    const incompleteRequired = reportFields.filter(
      (field) => field.required && !field.completed
    );
    if (!arrivalCompleted) {
      Alert.alert(
        "Arrival Not Set",
        'Please press the "Arrived" button to set arrival time.'
      );
      return false;
    }
    if (incompleteRequired.length > 0) {
      Alert.alert(
        "Incomplete Required Fields",
        `Please complete:\n${incompleteRequired.map((f) => f.title).join("\n")}`,
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const getCurrentTime = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading report...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with Progress Bar */}
      <LinearGradient colors={["#8B5CF6", "#EC4899"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Daily Report</Text>
          <View style={styles.headerInfo}>
            <View style={styles.headerInfoItem}>
              <User color="#fff" size={16} />
              <Text style={styles.headerInfoText}>{childName}</Text>
            </View>
            <View style={styles.headerInfoItem}>
              <Calendar color="#fff" size={16} />
              <Text style={styles.headerInfoText}>{reportDate}</Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              Progress: {completedTasks}/{totalTasks} tasks completed
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Arrival Section */}

      <View style={styles.taskCard}>
        {/* Header */}
        <View style={styles.taskHeader}>
          <View style={styles.taskHeaderLeft}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#10B981" }]}
            >
              <Check size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.taskTitle}>Arrival</Text>
              <Text style={styles.taskSubtitle}>Required</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.taskContent}>
          <View style={styles.timeSection}>
            <Text style={styles.timeLabel}>Arrival Time:</Text>
            <Text style={styles.timeValue}>{arrivalTime || "Not set"}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              arrivalCompleted
                ? styles.actionButtonCompleted
                : styles.actionButtonPrimary,
            ]}
            onPress={saveArrivalTime}
            disabled={arrivalCompleted || isSubmitted}
          >
            <Clock size={16} color="#fff" />
            <Text style={styles.actionButtonText}>
              {arrivalCompleted ? "Arrived" : "Mark as Arrived"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Report Fields */}
      {reportFields.map((field) => (
        <View key={field.id} style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <View style={styles.taskHeaderLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: field.color }]}
              >
                <field.icon size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.taskTitle}>{field.title}</Text>
                <Text style={styles.taskSubtitle}>
                  {field.required ? "Required" : "Optional"}
                </Text>
              </View>
            </View>
            <View style={styles.taskHeaderRight}>
              <Switch
                value={field.completed}
                onValueChange={() => toggleComplete(field.id)}
                disabled={isSubmitted}
                trackColor={{ false: "#E5E7EB", true: field.color }}
                thumbColor={field.completed ? "#fff" : "#f4f3f4"}
              />
            </View>
          </View>

          <View style={styles.taskContent}>
            <View style={styles.dataSection}>
              <Text style={styles.dataLabel}>Data by parent</Text>
              <View style={styles.dataContent}>
                <Text style={styles.dataText}>{field.description}</Text>
              </View>
            </View>

            <View style={styles.timeInputSection}>
              {/* <Text style={styles.timeLabel}>Time:</Text> */}
              <View style={styles.timeInputContainer}>
                {field.id === "medicine" && (
                  <>
                    <TextInput
                      placeholder="Enter time"
                      value={field.time}
                      onChangeText={(text) =>
                        updateField(field.id, "time", text)
                      }
                      editable={!isSubmitted}
                      style={styles.timeInput}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        updateField(field.id, "time", getCurrentTime())
                      }
                    >
                      <Text style={styles.nowButton}>Now</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      ))}

      {/* Special Notes */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Special Notes</Text>
        <View style={styles.notesContainer}>
          <Text style={styles.notesText}>
            {specialNotes || "No special notes available"}
          </Text>
        </View>
      </View>

      {/* Daily Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Summary</Text>
        <TextInput
          placeholder="Enter daily summary..."
          value={dailySummary}
          onChangeText={setDailySummary}
          multiline
          editable={!isSubmitted}
          style={styles.summaryInput}
        />
      </View>

      {/* Enhanced Checkout Section */}
      <View style={styles.checkoutCard}>
        <View style={styles.checkoutHeader}>
          <View style={styles.checkoutHeaderLeft}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#EF4444" }]}
            >
              <LogOut size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Checkout Information</Text>
              <Text style={styles.checkoutSubtitle}>End of day details</Text>
            </View>
          </View>
        </View>

        <View style={styles.checkoutContent}>
          <View style={styles.checkoutField}>
            <Text style={styles.checkoutFieldLabel}>
              <Users size={16} color="#374151" />
              <Text style={styles.checkoutFieldLabelText}> Pickup Person</Text>
            </Text>
            <View style={styles.pickerWrapper}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={checkoutPerson}
                  onValueChange={(itemValue) => setCheckoutPerson(itemValue)}
                  enabled={!isSubmitted}
                  style={styles.picker}
                >
                  <Picker.Item
                    label="Select guardian or authorized person"
                    value=""
                    color="#9CA3AF"
                  />
                  {guardians.map((guardian) => (
                    <Picker.Item
                      key={guardian}
                      label={guardian}
                      value={guardian}
                      color="#1F2937"
                    />
                  ))}
                </Picker>
              </View>
              {checkoutPerson ? (
                <View style={styles.selectedPersonIndicator}>
                  <Check size={16} color="#10B981" />
                  <Text style={styles.selectedPersonText}>
                    {checkoutPerson}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.checkoutField}>
            <Text style={styles.checkoutFieldLabel}>
              <Clock size={16} color="#374151" />
              <Text style={styles.checkoutFieldLabelText}> Checkout Time</Text>
            </Text>
            <View style={styles.timeInputContainer}>
              <TextInput
                placeholder="Enter checkout time"
                value={checkoutTime}
                onChangeText={setCheckoutTime}
                editable={!isSubmitted}
                style={styles.checkoutTimeInput}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                style={styles.checkoutNowButton}
                onPress={() => setCheckoutTime(getCurrentTime())}
                disabled={isSubmitted}
              >
                <Clock size={16} color="#fff" />
                <Text style={styles.checkoutNowButtonText}>Set Now</Text>
              </TouchableOpacity>
            </View>
            {checkoutTime ? (
              <View style={styles.timeConfirmation}>
                <Check size={14} color="#10B981" />
                <Text style={styles.timeConfirmationText}>
                  Checkout scheduled for {checkoutTime}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Checkout Summary */}
          {(checkoutPerson || checkoutTime) && (
            <View style={styles.checkoutSummary}>
              <Text style={styles.checkoutSummaryTitle}>Checkout Summary</Text>
              <View style={styles.checkoutSummaryContent}>
                {checkoutPerson && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Pickup by:</Text>
                    <Text style={styles.summaryValue}>{checkoutPerson}</Text>
                  </View>
                )}
                {checkoutTime && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Time:</Text>
                    <Text style={styles.summaryValue}>{checkoutTime}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={saveProgress}
          disabled={isSubmitted}
        >
          <Save color="#fff" size={18} />
          <Text style={styles.actionButtonText}>Save Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            isSubmitted ? styles.actionButtonDisabled : styles.submitButton,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitted}
        >
          <Send color="#fff" size={18} />
          <Text style={styles.actionButtonText}>
            {isSubmitted ? "Submitted" : "Submit Report"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748B",
  },
  header: {
    borderRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
    padding: 8,
  },
  headerContent: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerInfoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerInfoText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
    opacity: 0.9,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  progressPercentage: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  taskCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  taskHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  taskHeaderRight: {
    marginLeft: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  taskSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  taskContent: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
  },
  dataSection: {
    marginBottom: 16,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  dataContent: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  dataText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  timeSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timeInputSection: {
    marginTop: 8,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  nowButton: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nowButtonText: {
    color: "#8B5CF6",
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  notesContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  notesText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  summaryInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    minHeight: 100,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  // Enhanced Checkout Styles
  checkoutCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  checkoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkoutHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkoutSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  checkoutContent: {
    gap: 20,
  },
  checkoutField: {
    gap: 12,
  },
  checkoutFieldLabel: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  checkoutFieldLabelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  pickerWrapper: {
    gap: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  picker: {
    height: 50,
    color: "#1F2937",
  },
  selectedPersonIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    padding: 8,
    gap: 6,
  },
  selectedPersonText: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
  },
  checkoutTimeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1F2937",
  },
  checkoutNowButton: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  checkoutNowButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  timeConfirmation: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    padding: 8,
    gap: 6,
  },
  timeConfirmationText: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
  },
  checkoutSummary: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  checkoutSummaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
    marginBottom: 12,
  },
  checkoutSummaryContent: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#7F1D1D",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    color: "#991B1B",
    fontWeight: "600",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonPrimary: {
    backgroundColor: "#10B981",
  },
  actionButtonCompleted: {
    backgroundColor: "#6B7280",
  },
  saveButton: {
    backgroundColor: "#6B7280",
  },
  submitButton: {
    backgroundColor: "#10B981",
  },
  actionButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
