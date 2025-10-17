import { images } from "@/assets/images/images";
import CustomAlert from "@/components/CustomAlert";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { useChildId } from "@/hooks/useChildId";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/utility";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

interface PaymentHistory {
  id: number;
  order_id: string;
  child_id: number;
  parent_email: string;
  amount: string;
  currency: string;
  status: "completed" | "pending" | "failed";
  created_at: string;
  paid_at: string | null;
}

interface PackageData {
  package_id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  services?: string[];
  created_at: string;
  updated_at: string;
}

function PaymentInterface() {
  const { customAlert, showCustomAlert, hideCustomAlert } = useCustomAlert();
  const { childId, hasChild, childrenCount } = useChildId();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [packageLoading, setPackageLoading] = useState(false);

  // Log child ID for debugging and fetch package details
  useEffect(() => {
    if (childId) {
      console.log("Child ID from session:", childId);
      console.log("Total children:", childrenCount);
      fetchPackageDetails();
    }
  }, [childId, childrenCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPackageDetails = async () => {
    if (!childId) {
      setPackageLoading(false);
      return;
    }

    try {
      setPackageLoading(true);
      console.log("Fetching package details for child ID:", childId);

      const response = await fetch(`${API_BASE_URL}/supervisors/child/package/${childId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch package details: ${response.status}`);
      }

      const result = await response.json();
      console.log("Package API response:", result);

      if (result.success && result.data) {
        setPackageData(result.data);
        console.log("Package details set:", result.data);
      } else {
        throw new Error("Invalid response format or no package found");
      }
    } catch (error) {
      console.error("Error fetching package details:", error);
      Alert.alert(
        "Error",
        "Failed to load package details. Using default values."
      );

      // Set fallback data if API fails
      setPackageData({
        package_id: 0,
        name: "Default Package",
        description: "Standard daycare package",
        price: 5000,
        duration: "Monthly",
        services: ["Full Day Care", "Educational Activities"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } finally {
      setPackageLoading(false);
    }
  };

  // Get package details from API data or fallback to defaults
  const getPackageDetails = () => {
    if (packageData) {
      return {
        name: packageData.name || "Child's Package",
        price:
          `LKR ${packageData.price?.toLocaleString()}.00` || "LKR 5,000.00",
        duration: packageData.duration || "Monthly",
        services: packageData.services || [
          "Full Day Care (8 hours)",
          "Educational Activities",
          "Medical Care Support",
          "Parent Progress Reports",
          "Only Weekdays",
        ],
        description: packageData.description || "Complete daycare package",
      };
    }

    // Default values when package data is not loaded
    return {
      name: "Loading Package...",
      price: "LKR 0.00",
      duration: "Monthly",
      services: ["Loading services..."],
      description: "Loading package details...",
    };
  };

  const packageDetails = getPackageDetails(); // Fetch payment history from backend
  const fetchPaymentHistory = async () => {
    if (!childId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/payment/history/${childId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payment history");
      }

      const data = await response.json();
      setPaymentHistory(data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      Alert.alert("Error", "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  // Load payment history when component mounts or when child ID changes
  useEffect(() => {
    if (childId) {
      fetchPaymentHistory();
    }
  }, [childId]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "failed":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "checkmark-circle";
      case "pending":
        return "time-outline";
      case "failed":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const handlePayment = async () => {
    // Navigate to payment page with child ID and package info
    if (!childId) {
      showCustomAlert("error", "Error", "No child data available");
      return;
    }

    if (!packageData) {
      showCustomAlert("error", "Error", "Package information not loaded");
      return;
    }

    console.log("Processing payment for child ID:", childId);
    console.log("Package data:", packageData);

    router.push({
      pathname: "./payment",
      params: {
        paymentType: "monthly",
        amount: packageData.price.toString(),
        child_id: childId.toString(),
        package_id: packageData.package_id.toString(),
        package_name: packageData.name,
      },
    });
  };

  const handleDailyPayment = async () => {
    // Navigate to payment page with child ID and package info
    if (!childId) {
      showCustomAlert("error", "Error", "No child data available");
      return;
    }

    router.push({
      pathname: "./payment",
      params: {
        paymentType: "daily",
        amount: 5000..toString(),
        child_id: childId.toString(),
        package_id: 0,
        package_name: "Daily Payment",
      },
    });
  }

  const handleRefresh = () => {
    fetchPaymentHistory();
  };

  const renderPaymentHistory = () => (
    <View className="mx-5 mt-5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-gray-800">Payment History</Text>
        <View className="flex-row">
          <TouchableOpacity onPress={handleRefresh} className="mr-3">
            <Ionicons name="refresh" size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowPaymentForm(true)}>
            <Text className="text-purple-600 font-medium">Make Payment</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="bg-white rounded-xl p-8 items-center">
          <Text className="text-gray-500">Loading payment history...</Text>
        </View>
      ) : (
        <>
          {paymentHistory.map((payment, index) => (
            <View key={payment.id} className="bg-white rounded-xl p-5 mb-3">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Ionicons
                    name={getStatusIcon(payment.status)}
                    size={20}
                    color={getStatusColor(payment.status)}
                  />
                  <Text className="text-lg font-semibold text-gray-800 ml-2">
                    {payment.currency} {payment.amount}
                  </Text>
                </View>
                <Text className="text-sm text-gray-600 capitalize">
                  {payment.status}
                </Text>
              </View>

              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-medium text-gray-700">
                  Order ID
                </Text>
                <Text className="text-sm text-gray-800">
                  {payment.order_id}
                </Text>
              </View>

              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-medium text-gray-700">Email</Text>
                <Text className="text-sm text-gray-800">
                  {payment.parent_email}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm font-medium text-gray-700">Date</Text>
                <Text className="text-sm text-gray-800">
                  {formatDate(payment.created_at)}
                </Text>
              </View>

              {payment.paid_at && (
                <View className="flex-row justify-between mt-2">
                  <Text className="text-sm font-medium text-gray-700">
                    Paid At
                  </Text>
                  <Text className="text-sm text-gray-800">
                    {formatDate(payment.paid_at)}
                  </Text>
                </View>
              )}
            </View>
          ))}

          {paymentHistory.length === 0 && (
            <View className="bg-white rounded-xl p-8 items-center">
              <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-500 text-center mt-4">
                No payment history found
              </Text>
              <TouchableOpacity
                onPress={() => setShowPaymentForm(true)}
                className="bg-purple-600 rounded-lg px-6 py-3 mt-4"
              >
                <Text className="text-white font-medium">
                  Make Your First Payment
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );

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
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-5 pt-2 mt-10 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 justify-center items-center"
            >
              <Ionicons name="chevron-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">
              {showPaymentForm ? "Make Payment" : "Payments"}
            </Text>
            <View className="w-10" />
          </View>

          {/* Package Details */}
          <View className="flex flex-row items-center justify-center mt-6 bg-purple-500 rounded-xl p-5 mx-5 shadow-lg">
            <View className="flex-1">
              <Image
                source={images.payment_child}
                className="w-20 h-32 rounded-lg ml-10"
              />
            </View>
            <View className="flex-2 mr-10">
              {packageLoading ? (
                <View>
                  <Text className="text-white font-bold text-xl">
                    Loading...
                  </Text>
                  <Text className="text-purple-100 text-sm mt-1">
                    Fetching package details
                  </Text>
                </View>
              ) : (
                <View>
                  <Text className="text-white font-bold text-xl">
                    {packageDetails.name}
                  </Text>
                  <Text className="text-green-300 font-bold text-2xl mt-2">
                    {packageDetails.price}
                  </Text>
                  <Text className="text-purple-100 text-sm mt-1">
                    {packageDetails.duration} Subscription
                  </Text>
                  {/* {packageData && (
                    <Text className="text-purple-200 text-xs mt-1">
                      ID: {packageData.package_id}
                    </Text>
                  )} */}
                </View>
              )}
            </View>
          </View>

          {/* Package Services */}
          <View className="bg-white rounded-xl p-5 mx-5 mt-5">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Package Includes:
            </Text>
            {packageLoading ? (
              <View className="flex-row items-center mb-2">
                <Ionicons name="time-outline" size={16} color="#6b7280" />
                <Text className="text-sm text-gray-500 ml-2">
                  Loading services...
                </Text>
              </View>
            ) : (
              <>
                {packageDetails.services.map((service, index) => (
                  <View key={index} className="flex-row items-center mb-2">
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#10b981"
                    />
                    <Text className="text-sm text-gray-700 ml-2">
                      {service}
                    </Text>
                  </View>
                ))}
                {packageData?.description && (
                  <View className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <Text className="text-xs font-medium text-gray-600 mb-1">
                      Description:
                    </Text>
                    <Text className="text-sm text-gray-700">
                      {packageData.description}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          {showPaymentForm ? (
            <>
              {/* Payment Methods */}
              <View className="mx-5 mt-5">
                <Text className="text-lg font-bold text-gray-800 mb-3">
                  Make Payment
                </Text>
                <View className="flex-row justify-center items-center ">
                  <Image source={images.baby_credit} className="w-60 h-60" />
                </View>
              </View>

              {/* Pay Button */}
              <View className="mx-5 mb-10">
                <TouchableOpacity
                  onPress={handlePayment}
                  disabled={isProcessing || packageLoading}
                  className={`rounded-xl p-4 items-center ${
                    isProcessing || packageLoading
                      ? "bg-gray-400"
                      : "bg-purple-600"
                  }`}
                >
                  <Text className="text-white font-bold text-lg">
                    {isProcessing
                      ? "Processing..."
                      : packageLoading
                        ? "Loading..."
                        : `Pay Monthly ${packageDetails.price}`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDailyPayment}
                  disabled={isProcessing || packageLoading}
                  className={`rounded-xl p-4 items-center mt-3 ${
                    isProcessing || packageLoading
                      ? "bg-gray-400"
                      : "bg-blue-600"
                  }`}
                >
                  <Text className="text-white font-bold text-lg">
                    {isProcessing
                      ? "Processing..."
                      : packageLoading
                        ? "Loading..."
                        : `Pay Daily LKR 5000.00`}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowPaymentForm(false)}
                  className="mt-3 p-4 items-center bg-red-600 rounded-lg"
                >
                  <Text className="text-white font-medium">Cancel</Text>
                </TouchableOpacity>

                <View className="flex-row items-center justify-center mt-4">
                  <Ionicons name="shield-checkmark" size={16} color="#10b981" />
                  <Text className="text-xs text-gray-600 ml-1">
                    Secure payment protected
                  </Text>
                </View>
              </View>
            </>
          ) : (
            renderPaymentHistory()
          )}
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

export default PaymentInterface;
