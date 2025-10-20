// app/daily-meal-tracker.tsx
import CustomAlert from "@/components/CustomAlert";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { API_BASE_URL } from "@/utility/index";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useContext } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@/contexts/UserContext";

console.log("API_BASE_URL:", API_BASE_URL);
export default function DailyMealTracker() {
  const { customAlert, showCustomAlert, hideCustomAlert } = useCustomAlert();
  const router = useRouter();
  const { user } = useUser();

  //const getTodayDate = () => new Date().toISOString().slice(0, 10);

  const [mealData, setMealData] = useState({
    breakfirst: "",
    morning_snack: "",
    lunch: "",
    evening_snack: "",
    special_note: "",
    date: new Date().toLocaleDateString(),
  });

  const [hasMedication, setHasMedication] = useState<string>("");
  const [showMedicationDropdown, setShowMedicationDropdown] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (field: string, value: string) => {
    setMealData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Check if user is logged in
    if (!user) {
      showCustomAlert(
        "error",
        "Authentication Required",
        "Please log in to submit daily records."
      );
      return;
    }

    if (
      !mealData.breakfirst &&
      !mealData.lunch &&
      !mealData.morning_snack &&
      !mealData.evening_snack &&
      !hasMedication &&
      !mealData.special_note
    ) {
      showCustomAlert(
        "error",
        "Missing Information",
        "Please enter at least one detail for the daily record (meal, medicine, or notes)."
      );
      return;
    }

    // Get child_id from user's first child
    const childId = user?.children?.[0]?.child_id;
    if (!childId) {
      showCustomAlert(
        "error",
        "No Child Found",
        "Unable to find child information. Please contact support."
      );
      return;
    }

    const dataToSend = {
      breakfirst: mealData.breakfirst,
      morning_snack: mealData.morning_snack,
      lunch: mealData.lunch,
      evening_snack: mealData.evening_snack,
      medicine: hasMedication === "Yes",
      special_note: mealData.special_note,
      date: new Date().toISOString().slice(0, 10),
      create_date: new Date().toISOString(),
      child_id: childId,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/parent/daily-records/parent/daily-records`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.ok) {
        showCustomAlert(
          "success",
          "Success!",
          "Daily record saved successfully."
        );
        setMealData({
          breakfirst: "",
          morning_snack: "",
          lunch: "",

          evening_snack: "",
          special_note: "",
          date: new Date().toLocaleDateString(),
        });
        setHasMedication("");
      } else {
        showCustomAlert("error", "Error", "Failed to save daily record.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      showCustomAlert("error", "Error", "Network or server error.");
    }
  };

  const mealSections = [
    {
      title: "Breakfast",
      icon: "sunny-outline",
      color: "#f59e0b",
      bgColor: "bg-amber-50",
      placeholder:
        "What did you pack for breakfast?\ne.g., Sandwich, milk, banana...",
      field: "breakfirst",
    },
    {
      title: "Morning Snacks",
      icon: "fast-food-outline",
      color: "#ec4899",
      bgColor: "bg-pink-50",
      placeholder: "What snacks did you pack?\ne.g., Cookies, juice, fruits...",
      field: "morning_snack",
    },
    {
      title: "Lunch",
      icon: "restaurant-outline",
      color: "#10b981",
      bgColor: "bg-emerald-50",
      placeholder:
        "What did you pack for lunch?\ne.g., Rice, curry, vegetables...",
      field: "lunch",
    },
    {
      title: "Evening Snacks",
      icon: "fast-food-outline",
      color: "#ec4899",
      bgColor: "bg-pink-50",
      placeholder: "What snacks did you pack?\ne.g., Cookies, juice, fruits...",
      field: "evening_snack",
    },
  ];

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
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 justify-center items-center"
            >
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-gray-700 mt-12">
              Daily Meal Tracker
            </Text>

            <View className="w-10" />
          </View>

          {/* Date Display */}
          <View className="px-6 mb-6">
            <View
              className="rounded-2xl p-4 flex-row items-center justify-center"
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
              <Ionicons name="calendar-outline" size={20} color="#7c3aed" />
              <Text className="text-lg font-semibold text-gray-700 ml-2">
                Today: {mealData.date}
              </Text>
            </View>
          </View>

          {/* Meal Input Sections */}
          <View className="px-6">
            {mealSections.map((section, index) => (
              <View key={index} className="mb-6">
                <View
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    shadowColor: section.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 4,
                    borderWidth: 1,
                    borderColor: `${section.color}20`,
                  }}
                >
                  {/* Section Header */}
                  <View className="flex-row items-center mb-4">
                    <View
                      className={`w-12 h-12 rounded-full ${section.bgColor} items-center justify-center mr-4`}
                    >
                      <Ionicons
                        name={section.icon as any}
                        size={24}
                        color={section.color}
                      />
                    </View>
                    <Text className="text-xl font-bold text-gray-800">
                      {section.title}
                    </Text>
                  </View>

                  {/* Input Field */}
                  <TextInput
                    value={
                      mealData[section.field as keyof typeof mealData] as string
                    }
                    onChangeText={(text) =>
                      handleInputChange(section.field, text)
                    }
                    placeholder={section.placeholder}
                    multiline
                    numberOfLines={4}
                    className="text-base text-gray-700 p-4 rounded-xl"
                    style={{
                      backgroundColor: "rgba(248, 250, 252, 0.8)",
                      borderWidth: 1,
                      borderColor: `${section.color}30`,
                      minHeight: 100,
                      textAlignVertical: "top",
                    }}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
            ))}

            {/* Medical Details */}
            <View className="mb-8">
              <View
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  shadowColor: "#f59e0b",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 4,
                  borderWidth: 1,
                  borderColor: "#f59e0b20",
                }}
              >
                {/* Section Header */}
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 rounded-full bg-amber-50 items-center justify-center mr-4">
                    <Ionicons
                      name="medical-outline"
                      size={24}
                      color="#f59e0b"
                    />
                  </View>
                  <Text className="text-xl font-bold text-gray-800">
                    Medical Instructions
                  </Text>
                </View>

                {/* Dropdown for Yes/No */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-600 mb-2">
                    Does your child need medication today?
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowMedicationDropdown(true)}
                    className="p-4 rounded-xl flex-row items-center justify-between"
                    style={{
                      backgroundColor: "rgba(248, 250, 252, 0.8)",
                      borderWidth: 1,
                      borderColor: "#f59e0b30",
                    }}
                  >
                    <Text
                      className={`text-base ${hasMedication ? "text-gray-700" : "text-gray-400"}`}
                    >
                      {hasMedication || "Select an option"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#f59e0b" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Medication Dropdown Modal */}
            <Modal
              visible={showMedicationDropdown}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowMedicationDropdown(false)}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={1}
                onPress={() => setShowMedicationDropdown(false)}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 16,
                    padding: 20,
                    width: "80%",
                    maxWidth: 300,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Text className="text-lg font-bold text-gray-800 mb-4 text-center">
                    Medication Required?
                  </Text>

                  {["Yes", "No"].map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        setHasMedication(option);
                        setShowMedicationDropdown(false);
                      }}
                      className="p-4 rounded-xl mb-2 flex-row items-center"
                      style={{
                        backgroundColor:
                          hasMedication === option ? "#f59e0b20" : "#f8fafc",
                        borderWidth: 1,
                        borderColor:
                          hasMedication === option ? "#f59e0b" : "#e2e8f0",
                      }}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor:
                            hasMedication === option ? "#f59e0b" : "#9ca3af",
                          backgroundColor:
                            hasMedication === option
                              ? "#f59e0b"
                              : "transparent",
                          marginRight: 12,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {hasMedication === option && (
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "white",
                            }}
                          />
                        )}
                      </View>
                      <Text
                        className={`text-base font-medium ${
                          hasMedication === option
                            ? "text-amber-600"
                            : "text-gray-700"
                        }`}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            {/* Special Instructions */}
            <View className="mb-8">
              <View
                className="rounded-2xl p-6"
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
                {/* Section Header */}
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 rounded-full bg-purple-50 items-center justify-center mr-4">
                    <Ionicons
                      name="document-text-outline"
                      size={24}
                      color="#7c3aed"
                    />
                  </View>
                  <Text className="text-xl font-bold text-gray-800">
                    Special Instruction
                  </Text>
                </View>

                {/* Input Field */}
                <TextInput
                  value={mealData.special_note}
                  onChangeText={(text) =>
                    handleInputChange("special_note", text)
                  }
                  placeholder="Any special dietary instructions, allergies, or notes for the teachers..."
                  multiline
                  numberOfLines={3}
                  className="text-base text-gray-700 p-4 rounded-xl"
                  style={{
                    backgroundColor: "rgba(248, 250, 252, 0.8)",
                    borderWidth: 1,
                    borderColor: "rgba(124, 58, 237, 0.3)",
                    minHeight: 80,
                    textAlignVertical: "top",
                  }}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity onPress={handleSubmit} className="mb-8">
              <LinearGradient
                colors={["#7c3aed", "#a855f7"]}
                start={[0, 0]}
                end={[1, 1]}
                className="rounded-2xl py-4 items-center"
                style={{
                  shadowColor: "#7c3aed",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                  borderRadius: 16,
                }}
              >
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text className="text-white text-lg font-semibold ml-2">
                    Save Daily Meals
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Quick Tips Card */}
            <View className="mb-8">
              <View
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderWidth: 2,
                  borderColor: "#7c3aed",
                  borderStyle: "dashed",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center mb-3">
                  <Ionicons name="bulb-outline" size={24} color="#7c3aed" />
                  <Text className="text-lg font-bold text-purple-600 ml-2">
                    Quick Tips
                  </Text>
                </View>
                <Text className="text-gray-600 text-sm leading-5">
                  • Be specific about portion sizes{"\n"}• Mention any heating
                  instructions{"\n"}• Include utensils if needed{"\n"}• Note any
                  food allergies or restrictions{"\n"}• Update daily for best
                  care
                </Text>
              </View>
            </View>
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
