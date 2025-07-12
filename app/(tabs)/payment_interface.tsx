import { images } from '@/assets/images/images';
import CustomAlert from '@/components/CustomAlert';
import { useCustomAlert } from '@/hooks/useCustomAlert';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type PaymentMethod = 'card' | 'mobile' | 'bank';

interface PaymentHistory {
  id: string;
  amount: string;
  method: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

function PaymentInterface() {
  const { customAlert, showCustomAlert, hideCustomAlert } = useCustomAlert();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const packageDetails = {
    name: "Child's Monthly Package",
    price: 'LKR 5,000.00',
    duration: 'Monthly',
    features: [
      'Full Day Care (8 hours)',
      'Educational Activities',
      'Medical Care Support',
      'Parent Progress Reports',
      'Only Weekdays',
    ],
  };

  // Sample payment history data
  const paymentHistory: PaymentHistory[] = [
    {
      id: '1',
      amount: 'LKR 5,000.00',
      method: 'Credit/Debit Card',
      date: '2024-06-01',
      status: 'completed'
    },
    {
      id: '2',
      amount: 'LKR 5,000.00',
      method: 'Credit/Debit Card',
      date: '2024-05-01',
      status: 'completed'
    },
    {
      id: '3',
      amount: 'LKR 5,000.00',
      method: 'Credit/Debit Card',
      date: '2024-04-01',
      status: 'completed'
    },
  ];

  const paymentMethods = [
    {
      id: 'card' as PaymentMethod,
      name: 'Credit/Debit Card',
      icon: 'card-outline',
      color: '#3b82f6',
    },
    // {
    //   id: 'mobile' as PaymentMethod,
    //   name: 'Mobile Payment',
    //   icon: 'phone-portrait-outline',
    //   color: '#10b981',
    // },
    // {
    //   id: 'bank' as PaymentMethod,
    //   name: 'Bank Transfer',
    //   icon: 'business-outline',
    //   color: '#f59e0b',
    // },
  ];

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ').substr(0, 19) : '';
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'pending':
        return 'time-outline';
      case 'failed':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
        showCustomAlert('error', 'Missing Information', 'Please fill in all card details');
        return;
      }
    } else if (selectedPaymentMethod === 'mobile') {
      if (!mobileNumber) {
        showCustomAlert('error', 'Missing Information', 'Please enter your mobile number');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      showCustomAlert(
        'success',
        'Payment Successful!',
        'Your monthly daycare package has been activated. You will receive a confirmation email shortly.',
        false,
        () => {
          setShowPaymentForm(false);
          // Clear form
          setCardNumber('');
          setExpiryDate('');
          setCvv('');
          setCardHolderName('');
          setMobileNumber('');
        }
      );
    } catch {
      showCustomAlert('error', 'Payment Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCardPayment = () => (
    <View className="bg-white rounded-xl p-5 mx-5 mb-5">
      <Text className="text-lg font-bold text-gray-800 mb-4">Card Details</Text>
      
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Card Holder Name</Text>
        <TextInput
          value={cardHolderName}
          onChangeText={setCardHolderName}
          placeholder="John Doe"
          className="bg-gray-50 rounded-lg p-4 text-base"
          autoCapitalize="words"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Card Number</Text>
        <TextInput
          value={cardNumber}
          onChangeText={(text) => setCardNumber(formatCardNumber(text))}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={19}
          className="bg-gray-50 rounded-lg p-4 text-base"
        />
      </View>

      <View className="flex-row gap-4 mb-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-2">Expiry Date</Text>
          <TextInput
            value={expiryDate}
            onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
            className="bg-gray-50 rounded-lg p-4 text-base"
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-2">CVV</Text>
          <TextInput
            value={cvv}
            onChangeText={setCvv}
            placeholder="123"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            className="bg-gray-50 rounded-lg p-4 text-base"
          />
        </View>
      </View>
    </View>
  );

  // const renderMobilePayment = () => (
  //   <View className="bg-white rounded-xl p-5 mx-5 mb-5">
  //     <Text className="text-lg font-bold text-gray-800 mb-4">Mobile Payment</Text>
      
  //     <View className="mb-4">
  //       <Text className="text-sm font-medium text-gray-700 mb-2">Mobile Number</Text>
  //       <TextInput
  //         value={mobileNumber}
  //         onChangeText={setMobileNumber}
  //         placeholder="+94 77 123 4567"
  //         keyboardType="phone-pad"
  //         className="bg-gray-50 rounded-lg p-4 text-base"
  //       />
  //     </View>

  //     <View className="bg-blue-50 rounded-lg p-4">
  //       <Text className="text-sm text-blue-800">
  //         You will receive an SMS with payment instructions after clicking "Pay Now"
  //       </Text>
  //     </View>
  //   </View>
  // );

  // const renderBankTransfer = () => (
  //   <View className="bg-white rounded-xl p-5 mx-5 mb-5">
  //     <Text className="text-lg font-bold text-gray-800 mb-4">Bank Transfer Details</Text>
      
  //     <View className="bg-gray-50 rounded-lg p-4 space-y-2">
  //       <View className="flex-row justify-between mb-2">
  //         <Text className="text-sm font-medium text-gray-700">Bank Name:</Text>
  //         <Text className="text-sm text-gray-800">Little Stars Daycare Bank</Text>
  //       </View>
  //       <View className="flex-row justify-between mb-2">
  //         <Text className="text-sm font-medium text-gray-700">Account Number:</Text>
  //         <Text className="text-sm text-gray-800">1234567890</Text>
  //       </View>
  //       <View className="flex-row justify-between">
  //         <Text className="text-sm font-medium text-gray-700">Branch Code:</Text>
  //         <Text className="text-sm text-gray-800">001</Text>
  //       </View>
  //     </View>

  //     <View className="bg-amber-50 rounded-lg p-4 mt-4">
  //       <Text className="text-sm text-amber-800">
  //         Please use your child's name as the reference when making the transfer.
  //         Upload the receipt in the parent portal after payment.
  //       </Text>
  //     </View>
  //   </View>
  // );

  const renderPaymentHistory = () => (
    <View className="mx-5 mt-5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-gray-800">Payment History</Text>
        <TouchableOpacity onPress={() => setShowPaymentForm(true)}>
          <Text className="text-purple-600 font-medium">Make Payment</Text>
        </TouchableOpacity>
      </View>
      
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
                {payment.amount}
              </Text>
            </View>
            <Text className="text-sm text-gray-600 capitalize">
              {payment.status}
            </Text>
          </View>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm font-medium text-gray-700">Payment Method</Text>
            <Text className="text-sm text-gray-800">{payment.method}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-sm font-medium text-gray-700">Date</Text>
            <Text className="text-sm text-gray-800">{formatDate(payment.date)}</Text>
          </View>
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
            <Text className="text-white font-medium">Make Your First Payment</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={['#DFC1FD', '#f3e8ff', '#F5ECFE', '#F5ECFE', '#e9d5ff', '#DFC1FD']}
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
              {showPaymentForm ? 'Make Payment' : 'Payments'}
            </Text>
            <View className="w-10" />
          </View>

          {/* Package Details */}
          <View className="flex flex-row items-center justify-center mt-6 bg-purple-500 rounded-xl p-5 mx-5 shadow-lg">
            <View className="flex-1">
              <Image source={images.payment_child} className="w-20 h-32 rounded-lg" />
            </View>
            <View className="flex-2 ml-4">
              <Text className="text-white font-bold text-xl">{packageDetails.name}</Text>
              <Text className="text-green-300 font-bold text-2xl mt-2">{packageDetails.price}</Text>
              <Text className="text-purple-100 text-sm mt-1">{packageDetails.duration} Subscription</Text>
            </View>
          </View>

          {/* Package Features */}
          <View className="bg-white rounded-xl p-5 mx-5 mt-5">
            <Text className="text-lg font-bold text-gray-800 mb-3">Package Includes:</Text>
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
                <Text className="text-lg font-bold text-gray-800 mb-3">Make Payment</Text>
                <View className="flex-row justify-center items-center ">
                  <Image source={images.baby_credit} className="w-60 h-60" />
                </View>
              </View>

              {/* Payment Form */}
              <View className="mt-5">
                {selectedPaymentMethod === 'card' && renderCardPayment()}
                {/* {selectedPaymentMethod === 'mobile' && renderMobilePayment()}
                {selectedPaymentMethod === 'bank' && renderBankTransfer()} */}
              </View>

              {/* Pay Button */}
              <View className="mx-5 mb-10">
                <TouchableOpacity
                  onPress={handlePayment}
                  disabled={isProcessing}
                  className={`rounded-xl p-4 items-center ${
                    isProcessing ? 'bg-gray-400' : 'bg-purple-600'
                  }`}
                >
                  <Text className="text-white font-bold text-lg">
                    {isProcessing ? 'Processing...' : `Pay ${packageDetails.price}`}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setShowPaymentForm(false)}
                  className="mt-3 p-3 items-center"
                >
                  <Text className="text-gray-600 font-medium">Cancel</Text>
                </TouchableOpacity>
                
                <View className="flex-row items-center justify-center mt-4">
                  <Ionicons name="shield-checkmark" size={16} color="#10b981" />
                  <Text className="text-xs text-gray-600 ml-1">
                    Secure payment protected by 256-bit SSL encryption
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