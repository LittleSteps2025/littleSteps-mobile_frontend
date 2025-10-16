// app/daily-meal-view.tsx
import CustomAlert from "@/components/CustomAlert";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { API_BASE_URL } from "@/utility/index";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MealRecord {
  id?: number;
  report_id?: number;
  breakfirst: string;
  morning_snack: string;
  lunch: string;
  evening_snack: string;
  medicine: boolean;
  special_note: string;
  create_date: string;
  child_id: number;
  teacher_id?: number;
  teacher_name?: string;
  arrived_time?: string;
  checkout_time?: string;
  checkout_person?: string;
  breakfirst_status?: boolean;
  morning_snack_status?: boolean;
  lunch_status?: boolean;
  evening_snack_status?: boolean;
  medicine_status?: boolean;
  progress?: number;
  day_summery?: string;
}

export default function DailyMealView() {
  const { customAlert, showCustomAlert, hideCustomAlert } = useCustomAlert();
  const router = useRouter();
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [viewMode, setViewMode] = useState<"single" | "all">("single");
  const [selectedChildId, setSelectedChildId] = useState<number>(1);

  const handleBack = () => {
    router.back();
  };

  const fetchMealRecords = async (showLoader = true, childId?: number) => {
    if (showLoader) setLoading(true);
    try {
      const targetChildId = childId || selectedChildId || 1;

      console.log(
        `Fetching meal records for child ${targetChildId} on ${selectedDate}`
      );

      // Use the correct endpoint structure
      const endpoint = `${API_BASE_URL}/parent/reports?child_id=${targetChildId}&date=${selectedDate}`;

      console.log(`Using endpoint: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Meal records data:", data);

      // Handle different response structures
      const records =
        data.data || data.records || data.dailyRecords || data || [];
      setMealRecords(
        Array.isArray(records) ? records : [records].filter(Boolean)
      );
    } catch (err) {
      console.error("Fetch meal records error:", err);
      showCustomAlert(
        "error",
        "Error",
        "Unable to fetch meal records. Please check your connection and try again."
      );
      setMealRecords([]);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (viewMode === "single") {
      await fetchMealRecords(false);
    } else {
      await fetchAllChildrenMealRecords();
    }
    setRefreshing(false);
  };

  // Function to fetch meal records for all children
  const fetchAllChildrenMealRecords = async () => {
    setLoading(true);
    try {
      console.log(
        `Fetching all children meal records for date: ${selectedDate}`
      );

      // Use the correct endpoint for all children
      const endpoint = `${API_BASE_URL}/parent/reports/all?date=${selectedDate}`;

      console.log(`Using endpoint: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("All children meal records:", data);

      // Handle different response structures
      const records =
        data.data || data.records || data.dailyRecords || data || [];
      setMealRecords(Array.isArray(records) ? records : []);
    } catch (err) {
      console.error("Fetch all children meal records error:", err);
      showCustomAlert(
        "error",
        "Error",
        "Unable to fetch meal records for all children. Please try again."
      );
      setMealRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // const navigateToTracker = () => {
  //   router.push('/dailyRecords');
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate);
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().slice(0, 10));
  };

  useEffect(() => {
    console.log("ViewReport useEffect triggered:", {
      selectedDate,
      viewMode,
      selectedChildId,
      API_BASE_URL,
    });

    if (viewMode === "single") {
      fetchMealRecords();
    } else {
      fetchAllChildrenMealRecords();
    }
  }, [selectedDate, viewMode, selectedChildId]);

  const mealSections = [
    {
      title: "Breakfast",
      icon: "sunny-outline",
      color: "#f59e0b",
      bgColor: "bg-amber-50",
      field: "breakfirst",
      statusField: "breakfirst_status",
    },
    {
      title: "Morning Snacks",
      icon: "fast-food-outline",
      color: "#ec4899",
      bgColor: "bg-pink-50",
      field: "morning_snack",
      statusField: "morning_snack_status",
    },
    {
      title: "Lunch",
      icon: "restaurant-outline",
      color: "#10b981",
      bgColor: "bg-emerald-50",
      field: "lunch",
      statusField: "lunch_status",
    },
    {
      title: "Evening Snacks",
      icon: "fast-food-outline",
      color: "#ec4899",
      bgColor: "bg-pink-50",
      field: "evening_snack",
      statusField: "evening_snack_status",
    },
  ];

  const renderMealSection = (
    section: any,
    content: string,
    status: boolean | string,
    record: MealRecord
  ) => {
    const hasContent =
      content && typeof content === "string" && content.trim() !== "";
    const hasStatus = status !== undefined && status !== null && status !== "";

    if (!hasContent && !hasStatus) return null;

    const getStatusColor = (status: boolean | string) => {
      if (typeof status === "boolean") {
        return status ? "#10b981" : "#ef4444"; // green for true, red for false
      }
      // Handle string values for backward compatibility
      switch (status?.toString().toLowerCase()) {
        case "true":
        case "completed":
        case "finished":
        case "eaten":
          return "#10b981"; // green
        case "false":
        case "not eaten":
        case "refused":
          return "#ef4444"; // red
        default:
          return "#6b7280"; // gray
      }
    };

    const getStatusIcon = (status: boolean | string) => {
      if (typeof status === "boolean") {
        return status ? "checkmark-circle" : "close-circle";
      }
      // Handle string values for backward compatibility
      switch (status?.toString().toLowerCase()) {
        case "true":
        case "completed":
        case "finished":
        case "eaten":
          return "checkmark-circle";
        case "false":
        case "not eaten":
        case "refused":
          return "close-circle";
        default:
          return "help-circle";
      }
    };

    const getStatusText = (status: boolean | string) => {
      if (typeof status === "boolean") {
        return status ? "Done" : "Not Done";
      }
      return status?.toString() || "Unknown";
    };

    return (
      <View key={section.field} className="py-3 border-b border-gray-200">
        <View className="flex-row items-center mb-2">
          <View
            className={`w-8 h-8 rounded-full ${section.bgColor} items-center justify-center mr-3`}
          >
            <Ionicons
              name={section.icon as any}
              size={16}
              color={section.color}
            />
          </View>
          <Text className="text-sm font-semibold text-gray-700 flex-1">
            {section.title}
          </Text>
          {hasStatus && (
            <View className="flex-row items-center">
              <Ionicons
                name={getStatusIcon(status) as any}
                size={16}
                color={getStatusColor(status)}
              />
              <Text
                className="text-xs font-medium ml-1"
                style={{ color: getStatusColor(status) }}
              >
                {getStatusText(status)}
              </Text>
            </View>
          )}
        </View>
        {hasContent && (
          <View className="ml-11">
            <Text className="text-sm text-gray-600 leading-5">{content}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderSpecialSection = (
    title: string,
    icon: string,
    content: string,
    color: string
  ) => {
    if (!content || typeof content !== "string" || content.trim() === "")
      return null;

    return (
      <View
        key={title}
        className="flex-row items-center py-3 border-b border-gray-200"
      >
        <View className="flex-row items-center flex-1">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center mr-3`}
            style={{ backgroundColor: `${color}15` }}
          >
            <Ionicons name={icon as any} size={16} color={color} />
          </View>
          <Text className="text-sm font-semibold text-gray-700 w-20">
            {title}:
          </Text>
        </View>
        <View className="flex-2">
          <Text className="text-sm text-gray-600 leading-5">{content}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
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
        className="flex-1"
      >
        <SafeAreaView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text className="text-lg text-gray-600 mt-4">
            Loading meal records...
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

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
      className="flex-1"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#DFC1FD" />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 justify-center items-center"
            >
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>

            {/* <Text className="text-2xl font-bold text-gray-700 mt-12">
              Daily Meal Records
            </Text> */}

            {/* <TouchableOpacity 
              onPress={navigateToTracker}
              className="w-10 h-10 justify-center items-center"
            >
              <Ionicons name="add" size={24} color="#374151" />
            </TouchableOpacity> */}
          </View>

          {/* Debug Info */}
          {/* <View className="px-6 mb-4">
            <View className="bg-gray-100 p-3 rounded-lg">
              <Text className="text-xs text-gray-600">
                API Base: {API_BASE_URL}
              </Text>
              <Text className="text-xs text-gray-600">
                Selected Date: {selectedDate}
              </Text>
              <Text className="text-xs text-gray-600">
                View Mode: {viewMode} | Child ID: {selectedChildId}
              </Text>
              <Text className="text-xs text-gray-600">
                Records Found: {mealRecords.length}
              </Text>
            </View>
          </View> */}

          {/* Date Navigation */}
          <View className="px-6 mb-4">
            <View
              className="rounded-2xl p-4 flex-row items-center justify-between"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                shadowColor: "#7c3aed",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
                borderWidth: 1,
                borderColor: "rgba(124, 58, 237, 0.1)",
              }}
            >
              <TouchableOpacity
                onPress={() => navigateDate("prev")}
                className="p-2"
              >
                <Ionicons name="chevron-back" size={20} color="#7c3aed" />
              </TouchableOpacity>

              <View className="flex-1 items-center">
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={20} color="#7c3aed" />
                  <Text className="text-lg font-semibold text-gray-700 ml-2">
                    {formatDate(selectedDate)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => navigateDate("next")}
                className="p-2"
                disabled={selectedDate >= new Date().toISOString().slice(0, 10)}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={
                    selectedDate >= new Date().toISOString().slice(0, 10)
                      ? "#d1d5db"
                      : "#7c3aed"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* View Mode Toggle */}
          {/* <View className="px-6 mb-6">
            <View
              className="rounded-2xl p-2 flex-row"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                shadowColor: '#7c3aed',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <TouchableOpacity
                onPress={() => setViewMode('single')}
                className={`flex-1 py-3 px-4 rounded-xl ${viewMode === 'single' ? 'bg-purple-600' : 'bg-transparent'}`}
              >
                <Text className={`text-center font-semibold ${viewMode === 'single' ? 'text-white' : 'text-gray-600'}`}>
                  Single Child
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setViewMode('all')}
                className={`flex-1 py-3 px-4 rounded-xl ${viewMode === 'all' ? 'bg-purple-600' : 'bg-transparent'}`}
              >
                <Text className={`text-center font-semibold ${viewMode === 'all' ? 'text-white' : 'text-gray-600'}`}>
                  All Children
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}

          {/* Content */}
          <View className="px-6">
            {mealRecords.length === 0 ? (
              <View className="items-center justify-center py-20">
                <View
                  className="rounded-2xl p-8 items-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    shadowColor: "#7c3aed",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 4,
                    borderWidth: 1,
                    borderColor: "rgba(124, 58, 237, 0.1)",
                  }}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={48}
                    color="#d1d5db"
                  />
                  <Text className="text-xl font-semibold text-gray-500 mt-4 text-center">
                    No meal records found
                  </Text>
                  <Text className="text-gray-400 text-center mt-2">
                    for {formatDate(selectedDate)}
                  </Text>
                  <TouchableOpacity>
                    <LinearGradient
                      colors={["#7c3aed", "#a855f7"]}
                      start={[0, 0]}
                      end={[1, 1]}
                      className="rounded-xl px-6 py-3"
                    >
                      {/* <Text className="text-white font-semibold">
                        Add Meal Record
                      </Text> */}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              mealRecords.map((record, index) => (
                <View key={index} className="mb-6">
                  {/* Report Header */}
                  <View
                    className="rounded-t-2xl p-4"
                    style={{
                      backgroundColor: "rgba(124, 58, 237, 0.9)",
                      shadowColor: "#7c3aed",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="document-text"
                          size={24}
                          color="white"
                        />
                        <Text className="text-lg font-bold text-white ml-2">
                          Daily Summary Report
                        </Text>
                      </View>
                      {record.id && (
                        <Text className="text-sm text-purple-100">
                          #{record.id}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Report Content */}
                  <View
                    className="rounded-b-2xl p-6"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      shadowColor: "#7c3aed",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      elevation: 4,
                      borderWidth: 1,
                      borderColor: "rgba(124, 58, 237, 0.2)",
                    }}
                  >
                    {/* Report Info Header */}
                    <View className="mb-4 pb-4 border-b-2 border-purple-100">
                      <View className="flex-row justify-between items-center mb-2">
                        <View className="flex-row items-center">
                          <Ionicons name="calendar" size={16} color="#7c3aed" />
                          <Text className="text-sm font-semibold text-gray-700 ml-2">
                            Date: {formatDate(record.create_date)}
                          </Text>
                        </View>
                        {/* <View className="flex-row items-center">
                          <Ionicons name="people" size={16} color="#7c3aed" />
                          <Text className="text-sm font-semibold text-gray-700 ml-2">
                            Child ID: {record.child_id}
                          </Text>
                        </View> */}
                      </View>

                      {/* Attendance Times */}
                      {(record.arrived_time || record.checkout_time) && (
                        <View className="mb-2">
                          <View className="flex-row justify-between items-center">
                            {record.arrived_time && (
                              <View className="flex-row items-center">
                                <Ionicons
                                  name="log-in"
                                  size={16}
                                  color="#10b981"
                                />
                                <Text className="text-sm font-semibold text-gray-700 ml-2">
                                  Arrived:{" "}
                                  {new Date(
                                    record.arrived_time
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </Text>
                              </View>
                            )}
                            {record.checkout_time && (
                              <View className="flex-row items-center">
                                <Ionicons
                                  name="log-out"
                                  size={16}
                                  color="#ef4444"
                                />
                                <Text className="text-sm font-semibold text-gray-700 ml-2">
                                  Checkout:{" "}
                                  {new Date(
                                    record.checkout_time
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </Text>
                              </View>
                            )}
                          </View>
                          {record.checkout_person && (
                            <View className="flex-row items-center mt-2">
                              <Ionicons
                                name="person-outline"
                                size={16}
                                color="#8b5cf6"
                              />
                              <Text className="text-sm font-semibold text-gray-700 ml-2">
                                Picked up by: {record.checkout_person}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}

                      {record.teacher_name && (
                        <View className="flex-row items-center">
                          <Ionicons name="person" size={16} color="#7c3aed" />
                          <Text className="text-sm font-semibold text-gray-700 ml-2">
                            Submitted by: {record.teacher_name}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Meal Details Section */}
                    <View className="mb-4">
                      <View className="flex-row items-center mb-3">
                        <Ionicons name="restaurant" size={18} color="#7c3aed" />
                        <Text className="text-lg font-bold text-gray-800 ml-2">
                          Meal Details
                        </Text>
                      </View>
                      <View className="bg-gray-50 rounded-xl p-4">
                        {mealSections.map((section) =>
                          renderMealSection(
                            section,
                            record[section.field as keyof MealRecord] as string,
                            record[
                              section.statusField as keyof MealRecord
                            ] as boolean,
                            record
                          )
                        )}
                      </View>
                    </View>

                    {/* Medical & Special Instructions */}
                    {(record.medicine ||
                      record.special_note ||
                      record.medicine_status !== undefined) && (
                      <View className="mb-4">
                        <View className="flex-row items-center mb-3">
                          <Ionicons name="medical" size={18} color="#f59e0b" />
                          <Text className="text-lg font-bold text-gray-800 ml-2">
                            Additional Information
                          </Text>
                        </View>
                        <View className="bg-amber-50 rounded-xl p-4">
                          {(record.medicine ||
                            record.medicine_status !== undefined) && (
                            <View className="flex-row items-center py-3 border-b border-gray-200">
                              <View className="flex-row items-center flex-1">
                                <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-3">
                                  <Ionicons
                                    name="medical-outline"
                                    size={16}
                                    color="#f59e0b"
                                  />
                                </View>
                                <Text className="text-sm font-semibold text-gray-700 w-20">
                                  Medicine:
                                </Text>
                              </View>
                              <View className="flex-2">
                                <Text className="text-sm text-gray-600 leading-5">
                                  {record.medicine
                                    ? "Required"
                                    : "Not Required"}
                                </Text>
                                {record.medicine_status !== undefined && (
                                  <View className="flex-row items-center mt-1">
                                    <Ionicons
                                      name={
                                        record.medicine_status
                                          ? "checkmark-circle"
                                          : "close-circle"
                                      }
                                      size={14}
                                      color={
                                        record.medicine_status
                                          ? "#10b981"
                                          : "#ef4444"
                                      }
                                    />
                                    <Text
                                      className="text-xs font-medium ml-1"
                                      style={{
                                        color: record.medicine_status
                                          ? "#10b981"
                                          : "#ef4444",
                                      }}
                                    >
                                      {record.medicine_status
                                        ? "Given"
                                        : "Not Given"}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          )}

                          {/* {record.special_note && 
                            renderSpecialSection(
                              'Special Notes',
                              'document-text-outline',
                              record.special_note,
                              '#7c3aed'
                            )
                          } */}

                          {record.progress &&
                            renderSpecialSection(
                              "Progress",
                              "trending-up-outline",
                              record.progress.toString(),
                              "#10b981"
                            )}

                          {record.day_summery &&
                            renderSpecialSection(
                              "Day Summary",
                              "document-outline",
                              record.day_summery,
                              "#8b5cf6"
                            )}
                        </View>
                      </View>
                    )}

                    {/* Report Footer */}
                    <View
                      className="mt-4 pt-4 border-t border-gray-200"
                      style={{ borderStyle: "dashed" }}
                    >
                      <View className="flex-row justify-between items-center">
                        <Text className="text-xs text-gray-500">
                          Generated on {new Date().toLocaleDateString()}
                        </Text>
                        <View className="flex-row items-center">
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#10b981"
                          />
                          <Text className="text-xs text-green-600 ml-1 font-medium">
                            Report Complete
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
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
