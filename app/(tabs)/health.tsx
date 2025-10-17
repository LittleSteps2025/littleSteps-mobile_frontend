import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomAlert from "@/components/CustomAlert";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { useUser } from "@/contexts/UserContext";
import { API_BASE_URL } from "@/utility";

interface HealthRecord {
  child_id?: number;
  record_date?: string;
  type?: string;
  title?: string;
  description?: string;
  doctor?: string;
}

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
}: any) => (
  <View style={{ marginBottom: 12 }}>
    <Text
      style={{
        fontSize: 13,
        fontWeight: "500",
        color: "#6b7280",
        marginBottom: 6,
      }}
    >
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      multiline={multiline}
      numberOfLines={numberOfLines}
      editable={true}
      scrollEnabled={multiline}
      style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: multiline ? 16 : 12,
        fontSize: 16,
        color: "#374151",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        textAlignVertical: multiline ? "top" : "center",
      }}
    />
  </View>
);

export default function HealthRecords() {
  const router = useRouter();
  const params = useLocalSearchParams() as { childId?: string; id?: string };
  const { user } = useUser();
  const token = (user as any)?.token ?? "";
  const { customAlert, showCustomAlert, hideCustomAlert } = useCustomAlert();

  const [healthData, setHealthData] = useState({
    bloodType: "N/A",
    allergies: "N/A",
    emergencyMedicalInfo: "N/A",
  });
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const [isEditing, setIsEditing] = useState(false); // edit medical info
  const [showAddRecord, setShowAddRecord] = useState(false); // add/edit record modal
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [saving, setSaving] = useState(false);

  const [newRecord, setNewRecord] = useState({
    date: "",
    type: "checkup",
    title: "",
    description: "",
    doctor: "",
  });

  const resolveChildId = (): number | null => {
    const rawParam = params?.childId ?? params?.id;
    if (rawParam && !Number.isNaN(Number(rawParam))) return Number(rawParam);

    if (
      (user as any)?.selectedChildId &&
      !Number.isNaN(Number((user as any).selectedChildId))
    ) {
      return Number((user as any).selectedChildId);
    }

    if (
      user?.children &&
      Array.isArray(user.children) &&
      user.children.length > 0
    ) {
      const first = user.children[0] as any;
      const idFromSession = first?.child_id ?? first?.id ?? first?.childId;
      if (idFromSession && !Number.isNaN(Number(idFromSession)))
        return Number(idFromSession);
    }

    return null;
  };

  const fetchRecords = async () => {
    setLoadingRecords(true);
    const childId = resolveChildId();
    if (!childId) {
      showCustomAlert(
        "error",
        "No child selected",
        "Select a child before viewing health records."
      );
      setLoadingRecords(false);
      return;
    }

    const url = `${API_BASE_URL}/parent/health/public/medical-records/${childId}`;
    try {
      const resp = await fetch(url);
      const contentType = resp.headers.get("content-type") || "";
      const text = await resp.text();

      if (!contentType.includes("application/json")) {
        console.error("Server returned non-JSON:", resp.status, text);
        showCustomAlert(
          "error",
          "Server Error",
          `Server returned non-JSON response (${resp.status}).`
        );
        setLoadingRecords(false);
        return;
      }

      const json = JSON.parse(text);
      if (!resp.ok || !json.success) {
        console.error("API error", json);
        showCustomAlert(
          "error",
          "Error",
          json?.message || "Unable to load medical records."
        );
        setLoadingRecords(false);
        return;
      }

      const { medicalInfo, records } = json.data || {};

      setHealthData({
        bloodType: medicalInfo?.blood_type || "N/A",
        allergies: medicalInfo?.allergies || "N/A",
        emergencyMedicalInfo: medicalInfo?.medical_info || "N/A",
      });

      setHealthRecords(
        (records || []).map((r: any) => ({
          child_id: r.child_id,
          record_date: r.record_date,
          type: r.type,
          title: r.title,
          description: r.description,
          doctor: r.doctor,
        }))
      );
    } catch (err) {
      console.error("Fetch error", err);
      showCustomAlert("error", "Network Error", "Unable to reach the server.");
    } finally {
      setLoadingRecords(false);
    }
  };

  const selectedChildId = (user as any)?.selectedChildId;
  const userChildren = user?.children;
  const paramChildId = params?.childId;
  const paramId = params?.id;

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId, userChildren, paramChildId, paramId]);

  const handleBack = () => router.back();
  const handleHealthDataChange = (field: string, value: string) =>
    setHealthData((prev) => ({ ...prev, [field]: value }));
  const handleSaveHealthData = () => {
    showCustomAlert(
      "success",
      "Success",
      "Health information updated successfully!"
    );
    setIsEditing(false);
  };

  const openAddRecordModal = () => {
    setEditingRecord(null);
    setNewRecord({
      date: "",
      type: "checkup",
      title: "",
      description: "",
      doctor: "",
    });
    setShowAddRecord(true);
  };

  const openEditRecord = (record: HealthRecord) => {
    setEditingRecord(record);
    setNewRecord({
      date: record.record_date ?? "",
      type: record.type ?? "checkup",
      title: record.title ?? "",
      description: record.description ?? "",
      doctor: record.doctor ?? "",
    });
    setShowAddRecord(true);
  };

  const submitRecord = async () => {
    const childId = resolveChildId();
    if (!childId) {
      showCustomAlert(
        "error",
        "No child selected",
        "Select a child before saving a record."
      );
      return;
    }
    if (!newRecord.title || !newRecord.date) {
      showCustomAlert("error", "Validation", "Date and title are required.");
      return;
    }

    // Additional validations
    if (newRecord.title.trim().length < 3) {
      showCustomAlert(
        "error",
        "Validation",
        "Title must be at least 3 characters long."
      );
      return;
    }

    // Validate date format and check if not in future
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newRecord.date)) {
      showCustomAlert(
        "error",
        "Validation",
        "Date must be in YYYY-MM-DD format."
      );
      return;
    }

    const recordDate = new Date(newRecord.date + "T00:00:00");
    if (isNaN(recordDate.getTime())) {
      showCustomAlert("error", "Validation", "Invalid date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (recordDate > today) {
      showCustomAlert(
        "error",
        "Validation",
        "Record date cannot be in the future."
      );
      return;
    }

    const payload = {
      child_id: Number(childId),
      record_date: newRecord.date,
      type: newRecord.type,
      title: newRecord.title,
      description: newRecord.description ?? "",
    };

    const method = editingRecord ? "PUT" : "POST";
    const url = `${API_BASE_URL}/parent/health/medical-records`;

    setSaving(true);
    try {
      const headers: any = { "Content-Type": "application/json" };
      // token is not required — endpoints are public — but including it if available is harmless
      if (token) headers.Authorization = `Bearer ${token}`;

      const resp = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      // try to parse JSON safely
      let json;
      try {
        json = await resp.json();
      } catch (parseErr) {
        console.error("Invalid JSON response", parseErr);
        showCustomAlert(
          "error",
          "Server Error",
          "Invalid response from server."
        );
        setSaving(false);
        return;
      }

      if (!resp.ok || !json.success) {
        console.error("API error", json);
        showCustomAlert(
          "error",
          "Error",
          json?.message || "Failed to save record"
        );
        setSaving(false);
        return;
      }

      const saved: HealthRecord = json.data;

      if (editingRecord) {
        setHealthRecords((prev) =>
          prev.map((r) =>
            r.child_id === saved.child_id && r.record_date === saved.record_date
              ? { ...r, ...saved }
              : r
          )
        );
        showCustomAlert("success", "Updated", "Health record updated");
      } else {
        // place new record at top
        setHealthRecords((prev) => [{ ...saved }, ...prev]);
        showCustomAlert("success", "Created", "Health record added");
      }

      setShowAddRecord(false);
      setEditingRecord(null);
      setNewRecord({
        date: "",
        type: "checkup",
        title: "",
        description: "",
        doctor: "",
      });
    } catch (err) {
      console.error("Network error", err);
      showCustomAlert("error", "Network Error", "Unable to reach the server.");
    } finally {
      setSaving(false);
    }
  };

  const getRecordIcon = (type: string | undefined) => {
    switch (type) {
      case "checkup":
        return "medical";
      case "vaccination":
        return "shield-checkmark";
      case "illness":
        return "thermometer";
      case "medication":
        return "bandage";
      default:
        return "document-text";
    }
  };

  const getRecordColor = (type: string | undefined): [string, string] => {
    switch (type) {
      case "checkup":
        return ["#10b981", "#059669"];
      case "vaccination":
        return ["#3b82f6", "#2563eb"];
      case "illness":
        return ["#f59e0b", "#d97706"];
      case "medication":
        return ["#8b5cf6", "#7c3aed"];
      default:
        return ["#6b7280", "#4b5563"];
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <LinearGradient
      colors={[
        "#DFC1FD",
        "#f3e8ff",
        "#F5ECFE",
        "#F5ECFE",
        "#e9d5ff",
        "#DFC1FD",
      ]}
      start={[0, 0]}
      end={[1, 1]}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#DFC1FD" />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View
              style={{
                paddingHorizontal: 24,
                paddingTop: 12,
                paddingBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={handleBack}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="chevron-back" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
              <Text
                style={{ fontSize: 28, fontWeight: "700", color: "#1f2937" }}
              >
                Health Records
              </Text>
              <Text style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                Manage your child&apos;s medical information
              </Text>
            </View>

            <View style={{ paddingHorizontal: 24, marginTop: 12 }}>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "rgba(124,58,237,0.08)",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#1f2937",
                    }}
                  >
                    Medical Information
                  </Text>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: "#f3e8ff",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="medical" size={18} color="#7c3aed" />
                  </View>
                </View>

                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderColor: "#f3f4f6",
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "#fff1f2",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Ionicons
                        name="water-outline"
                        size={18}
                        color="#ef4444"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, color: "#6b7280" }}>
                        Blood Type
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {healthData.bloodType}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderColor: "#f3f4f6",
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "#fff7ed",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Ionicons
                        name="warning-outline"
                        size={18}
                        color="#f97316"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, color: "#6b7280" }}>
                        Allergies
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {healthData.allergies}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "#eff6ff",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Ionicons
                        name="alert-circle-outline"
                        size={18}
                        color="#3b82f6"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, color: "#6b7280" }}>
                        Emergency Medical Info
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {healthData.emergencyMedicalInfo}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={{ marginBottom: 12 }}
              >
                <LinearGradient
                  colors={["#7c3aed", "#a855f7"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{
                    borderRadius: 16,
                    paddingVertical: 14,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="create" size={18} color="white" />
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "700",
                        marginLeft: 8,
                      }}
                    >
                      Edit Medical Information
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={openAddRecordModal}
                style={{ marginBottom: 20 }}
              >
                <LinearGradient
                  colors={["#7c3aed", "#a855f7"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{
                    borderRadius: 16,
                    paddingVertical: 14,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="create" size={18} color="white" />
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "700",
                        marginLeft: 8,
                      }}
                    >
                      Add Health Record
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#374151",
                    marginBottom: 12,
                  }}
                >
                  Health Records History
                </Text>

                {loadingRecords ? (
                  <View style={{ alignItems: "center", paddingVertical: 20 }}>
                    <ActivityIndicator size="large" color="#7c3aed" />
                    <Text style={{ marginTop: 8, color: "#6b7280" }}>
                      Loading records...
                    </Text>
                  </View>
                ) : (
                  healthRecords.map((record) => (
                    <View
                      key={`${record.child_id}-${record.record_date}-${record.title}`}
                      style={{
                        marginBottom: 12,
                        padding: 12,
                        borderRadius: 16,
                        backgroundColor: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                        }}
                      >
                        <LinearGradient
                          colors={getRecordColor(record.type)}
                          start={[0, 0]}
                          end={[1, 1]}
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                          }}
                        >
                          <Ionicons
                            name={getRecordIcon(record.type) as any}
                            size={20}
                            color="white"
                          />
                        </LinearGradient>

                        <View style={{ flex: 1 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: "700",
                                  color: "#111827",
                                }}
                              >
                                {record.title}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: "#6b7280",
                                  marginTop: 6,
                                }}
                              >
                                {formatDate(record.record_date)}
                              </Text>
                            </View>

                            <TouchableOpacity
                              onPress={() => openEditRecord(record)}
                              style={{ marginLeft: 8, padding: 6 }}
                            >
                              <Ionicons
                                name="create"
                                size={18}
                                color="#7c3aed"
                              />
                            </TouchableOpacity>
                          </View>

                          <Text style={{ marginTop: 8, color: "#374151" }}>
                            {record.description}
                          </Text>
                          {record.doctor && (
                            <Text
                              style={{
                                marginTop: 6,
                                color: "#7c3aed",
                                fontWeight: "600",
                              }}
                            >
                              {record.doctor}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Edit Medical Info Modal */}
        <Modal
          visible={isEditing}
          transparent
          animationType="slide"
          onRequestClose={() => setIsEditing(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 18,
                maxHeight: "80%",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 4,
                  backgroundColor: "#e5e7eb",
                  borderRadius: 12,
                  alignSelf: "center",
                  marginBottom: 12,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                Edit Medical Information
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                <InputField
                  label="Blood Type"
                  value={healthData.bloodType}
                  onChangeText={(v: string) =>
                    handleHealthDataChange("bloodType", v)
                  }
                  placeholder="Enter blood type"
                />
                <InputField
                  label="Allergies"
                  value={healthData.allergies}
                  onChangeText={(v: string) =>
                    handleHealthDataChange("allergies", v)
                  }
                  placeholder="List any allergies"
                  multiline
                  numberOfLines={3}
                />
                <InputField
                  label="Emergency Medical Information"
                  value={healthData.emergencyMedicalInfo}
                  onChangeText={(v: string) =>
                    handleHealthDataChange("emergencyMedicalInfo", v)
                  }
                  placeholder="Special instructions"
                  multiline
                  numberOfLines={3}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 12,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setIsEditing(false)}
                    style={{
                      flex: 1,
                      marginRight: 8,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: "#f3f4f6",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#374151", fontWeight: "600" }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveHealthData}
                    style={{ flex: 1, marginLeft: 8 }}
                  >
                    <LinearGradient
                      colors={["#7c3aed", "#a855f7"]}
                      style={{
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "700" }}>
                        Save Changes
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Add/Edit Record Modal */}
        <Modal
          visible={showAddRecord}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setShowAddRecord(false);
            setEditingRecord(null);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 18,
                maxHeight: "80%",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 4,
                  backgroundColor: "#e5e7eb",
                  borderRadius: 12,
                  alignSelf: "center",
                  marginBottom: 12,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                {editingRecord ? "Edit Health Record" : "Add Health Record"}
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                <InputField
                  label="Date *"
                  value={newRecord.date}
                  onChangeText={(v: string) =>
                    setNewRecord((prev) => ({ ...prev, date: v }))
                  }
                  placeholder="YYYY-MM-DD"
                />
                <InputField
                  label="Title *"
                  value={newRecord.title}
                  onChangeText={(v: string) =>
                    setNewRecord((prev) => ({ ...prev, title: v }))
                  }
                  placeholder="Enter record title"
                />
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "500",
                      color: "#6b7280",
                      marginBottom: 6,
                    }}
                  >
                    Type *
                  </Text>
                  <View
                    style={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                    }}
                  >
                    <Picker
                      selectedValue={newRecord.type}
                      onValueChange={(itemValue) =>
                        setNewRecord((prev) => ({
                          ...prev,
                          type: itemValue as any,
                        }))
                      }
                      dropdownIconColor="#7c3aed"
                    >
                      <Picker.Item label="Checkup" value="checkup" />
                      <Picker.Item label="Vaccination" value="vaccination" />
                      <Picker.Item label="Illness" value="illness" />
                      <Picker.Item label="Medication" value="medication" />
                    </Picker>
                  </View>
                </View>

                <InputField
                  label="Description"
                  value={newRecord.description}
                  onChangeText={(v: string) =>
                    setNewRecord((prev) => ({ ...prev, description: v }))
                  }
                  placeholder="Enter description"
                  multiline
                  numberOfLines={3}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 12,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowAddRecord(false);
                      setEditingRecord(null);
                    }}
                    style={{
                      flex: 1,
                      marginRight: 8,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: "#f3f4f6",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#374151", fontWeight: "600" }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={submitRecord}
                    disabled={saving}
                    style={{ flex: 1, marginLeft: 8 }}
                  >
                    <LinearGradient
                      colors={["#7c3aed", "#a855f7"]}
                      style={{
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",
                        opacity: saving ? 0.7 : 1,
                      }}
                    >
                      {saving ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text style={{ color: "white", fontWeight: "700" }}>
                          {editingRecord ? "Update Record" : "Add Record"}
                        </Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      <CustomAlert
        visible={customAlert.visible}
        type={customAlert.type}
        title={customAlert.title}
        message={customAlert.message}
        showCancelButton={customAlert.showCancelButton}
        onConfirm={customAlert.onConfirm}
        onClose={hideCustomAlert}
      />
    </LinearGradient>
  );
}
