import { images } from "@/assets/images/images";
import CustomAlert from "@/components/CustomAlert";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
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

function PaymentInterface() {
  const { customAlert, showCustomAlert, hideCustomAlert } = useCustomAlert();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // You should get this from user context or props
  const child_id = 2; // Replace with actual child ID from context

  const packageDetails = {
    name: "Child's Monthly Package",
    price: "LKR 5,000.00",
    duration: "Monthly",
    features: [
      "Full Day Care (8 hours)",
      "Educational Activities",
      "Medical Care Support",
      "Parent Progress Reports",
      "Only Weekdays",
    ],
  };

  // Fetch payment history from backend
  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://192.168.225.156:5001/api/payment/history/${child_id}`,
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

  // Load payment history when component mounts
  useEffect(() => {
    fetchPaymentHistory();
  }, []);

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
    // Navigate to payment page with parameters
    router.push({
      pathname: "./payment",
      params: {
        paymentType: "monthly",
        amount: "5000.00",
        child_id: child_id.toString()
      }
    });
  };

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
                className="w-20 h-32 rounded-lg"
              />
            </View>
            <View className="flex-2 ml-4">
              <Text className="text-white font-bold text-xl">
                {packageDetails.name}
              </Text>
              <Text className="text-green-300 font-bold text-2xl mt-2">
                {packageDetails.price}
              </Text>
              <Text className="text-purple-100 text-sm mt-1">
                {packageDetails.duration} Subscription
              </Text>
            </View>
          </View>

          {/* Package Features */}
          <View className="bg-white rounded-xl p-5 mx-5 mt-5">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Package Includes:
            </Text>
            {packageDetails.features.map((feature, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text className="text-sm text-gray-700 ml-2">{feature}</Text>
              </View>
            ))}
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
                  disabled={isProcessing}
                  className={`rounded-xl p-4 items-center ${
                    isProcessing ? "bg-gray-400" : "bg-purple-600"
                  }`}
                >
                  <Text className="text-white font-bold text-lg">
                    {isProcessing
                      ? "Processing..."
                      : `Pay Monthly ${packageDetails.price}`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePayment}
                  disabled={isProcessing}
                  className={`rounded-xl p-4 items-center mt-3 ${
                    isProcessing ? "bg-gray-400" : "bg-blue-600"
                  }`}
                >
                  <Text className="text-white font-bold text-lg">
                    {isProcessing
                      ? "Processing..."
                      : `Pay Daily ${packageDetails.price}`}
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
