import { View, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";

export default function Payment() {
  // Get parameters from the route with defaults
  const { paymentType = 'monthly', amount = '5000.00', child_id = '2' } = useLocalSearchParams();

  // Clean amount value (remove 'LKR' and spaces if present)
  const cleanAmount = amount.toString().replace(/[^\d.]/g, '');

  // The exact same HTML that works in your test-payhere.html
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PayHere Test - LittleSteps</title>
        <script type="text/javascript" src="https://www.payhere.lk/lib/payhere.js"></script>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                text-align: center;
                background: #f5f5f5;
                margin: 0;
                justify-content: center;
                display: flex;
                align-items: center;
                min-height: 100vh;
            }
            .payment-container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 500px;
                margin: 20px auto;
            }
            .pay-button {
                background: #4CAF50;
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 5px;
                font-size: 18px;
                cursor: pointer;
                width: 100%;
                margin-top: 20px;
            }
            .pay-button:hover {
                background: #45a049;
            }
            .pay-button:disabled {
                background: #cccccc;
                cursor: not-allowed;
            }
            .amount {
                font-size: 24px;
                color: #333;
                margin: 20px 0;
            }
            .debug {
                background: #f9f9f9;
                padding: 15px;
                margin: 10px 0;
                border-radius: 5px;
                font-size: 12px;
                text-align: left;
                border-left: 4px solid #4CAF50;
                display: none;
            }
            .test-button {
                background: #2196F3;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 3px;
                margin: 5px;
                cursor: pointer;
                font-size: 14px;
            }
            .test-button:hover {
                background: #1976D2;
            }
            .status {
                margin: 10px 0;
                padding: 10px;
                border-radius: 5px;
                font-weight: bold;
            }
            .status.success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            .status.error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            .status.info {
                background: #cce7ff;
                color: #004085;
                border: 1px solid #b3d7ff;
            }
        </style>
    </head>
    <body>
        <div class="payment-container">
            <h1>🏫 LittleSteps Payment</h1>
            <div class="amount">Rs. ${cleanAmount}</div>
            <p>DayCare Fee Payment (${paymentType})</p>
            
            <div id="status-area"></div>
            
            <button type="button" id="create-payment" class="test-button">
                1️⃣ Create Payment Data
            </button>
            
            <button type="button" id="payhere-payment" class="pay-button" disabled>
                2️⃣ Pay with PayHere (Click Step 1 first)
            </button>
            
            <div style="display: none;" id="debug-info">
                <strong>Payment Data:</strong><br>
                <pre  id="payment-data"></pre>
            </div>
        </div>

        <script>
            let paymentData = null;

            // Payment configuration from React Native
            const PAYMENT_CONFIG = {
                paymentType: '${paymentType}',
                amount: '${cleanAmount}',
                child_id: ${child_id}
            };

            function showStatus(message, type = 'info') {
                console.log('[Status]', type + ':', message);
                const statusArea = document.getElementById('status-area');
                statusArea.innerHTML = '<div class="status ' + type + '">' + message + '</div>';
                
                // Also send status to React Native
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'status_update',
                        message: message,
                        statusType: type
                    }));
                }
            }

            // Check if PayHere is loaded
            function checkPayHere() {
                if (typeof payhere === 'undefined') {
                    showStatus('❌ PayHere library not loaded. Check internet connection.', 'error');
                    return false;
                } else {
                    showStatus('✅ PayHere library loaded successfully', 'success');
                    return true;
                }
            }

            // Create payment data
            document.getElementById('create-payment').onclick = async function() {
                try {
                    showStatus('🔄 Creating payment...', 'info');
                    
                    console.log('Payment config:', PAYMENT_CONFIG);
                    
                    const response = await fetch('http://192.168.225.156:5001/api/payment/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            child_id: PAYMENT_CONFIG.child_id,
                            parent_email: 'lakshan2020kavindu@gmail.com',
                            amount: PAYMENT_CONFIG.amount
                        })
                    });

                    if (!response.ok) {
                        throw new Error('HTTP ' + response.status + ': ' + response.statusText);
                    }

                    paymentData = await response.json();
                    console.log("Payment data:", paymentData);

                    // Show debug info
                
                    document.getElementById('payment-data').textContent = JSON.stringify(paymentData, null, 2);
                    
                    // Enable PayHere button
                    document.getElementById('payhere-payment').disabled = false;
                    document.getElementById('payhere-payment').textContent = '2️⃣ Pay with PayHere - READY! 💳';
                    
                    showStatus('✅ Payment data created successfully! Now click "Pay with PayHere"', 'success');
                    
                } catch (error) {
                    console.error("Error creating payment:", error);
                    showStatus('❌ Error creating payment: ' + error.message, 'error');
                }
            };

            // PayHere event handlers
            payhere.onCompleted = function onCompleted(orderId) {
                console.log("✅ Payment completed. OrderID:" + orderId);
                showStatus('🎉 Payment Successful! Order ID: ' + orderId, 'success');
                
                // Send success message to React Native
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'payment_success',
                        orderId: orderId,
                        message: 'Payment completed successfully!'
                    }));
                }
            };

            payhere.onDismissed = function onDismissed() {
                console.log("❌ Payment dismissed");
                showStatus('❌ Payment was cancelled by user', 'error');
                
                // Send cancel message to React Native
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'payment_cancelled',
                        message: 'Payment was cancelled'
                    }));
                }
            };

            payhere.onError = function onError(error) {
                console.log("❌ Payment error: " + error);
                showStatus('❌ Payment Error: ' + error, 'error');
                
                // Send error message to React Native
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'payment_error',
                        error: error,
                        message: 'Payment failed: ' + error
                    }));
                }
            };

            // Start PayHere payment
            document.getElementById('payhere-payment').onclick = function() {
                if (!paymentData) {
                    showStatus('❌ Please create payment data first!', 'error');
                    return;
                }

                if (!checkPayHere()) {
                    return;
                }

                console.log("Starting PayHere payment...");
                showStatus('🔄 Starting PayHere payment...', 'info');
                
                try {
                    // Validate required fields before creating payment object
                    const requiredFields = ['sandbox', 'merchant_id', 'order_id', 'amount', 'currency', 'hash', 'first_name', 'last_name', 'email', 'phone'];
                    const missingFields = requiredFields.filter(field => !paymentData[field]);
                    
                    if (missingFields.length > 0) {
                        throw new Error('Missing required payment fields: ' + missingFields.join(', '));
                    }
                    
                    var payment = {
                        "sandbox": paymentData.sandbox,
                        "merchant_id": paymentData.merchant_id,
                        "return_url": undefined,  // For popup mode
                        "cancel_url": undefined,  // For popup mode
                        "notify_url": paymentData.notify_url,
                        "order_id": paymentData.order_id,
                        "items": paymentData.items + " (" + PAYMENT_CONFIG.paymentType + ")",
                        "amount": paymentData.amount,
                        "currency": paymentData.currency,
                        "hash": paymentData.hash,
                        "first_name": paymentData.first_name,
                        "last_name": paymentData.last_name,
                        "email": paymentData.email,
                        "phone": paymentData.phone,
                        "address": paymentData.address,
                        "city": paymentData.city,
                        "country": paymentData.country,
                        "delivery_address": paymentData.delivery_address,
                        "delivery_city": paymentData.delivery_city,
                        "delivery_country": paymentData.delivery_country
                    };

                    console.log("Payment object:", payment);
                    
                    // Validate payment object
                    if (!payment.merchant_id || !payment.order_id || !payment.amount || !payment.hash) {
                        throw new Error('Invalid payment object - missing critical fields');
                    }
                    
                    // Add debugging before starting payment
                    showStatus('🚀 Calling payhere.startPayment()...', 'info');
                    
                    payhere.startPayment(payment);
                    
                } catch (error) {
                    console.error("Error starting PayHere:", error);
                    showStatus('❌ Error starting PayHere: ' + error.message, 'error');
                }
            };

            // Check PayHere availability when page loads
            window.onload = function() {
                console.log('Payment page loaded with config:', PAYMENT_CONFIG);
                showStatus('🚀 Payment page loaded. Ready to create payment.', 'info');
                
                setTimeout(function() {
                    if (checkPayHere()) {
                        showStatus('✅ PayHere ready - you can now create payment data', 'success');
                    }
                }, 2000); // Wait 2 seconds for PayHere to load
            };

            // Auto-create payment data when page loads (optional)
            // Uncomment the next line if you want to auto-create payment data
            // window.onload = () => document.getElementById('create-payment').click();
        </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsPopups={true}
        allowsBackForwardNavigationGestures={false}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log("PayHere Event:", data);

            if (data.type === "payment_success") {
              console.log("✅ Payment Success in Mobile App:", data.orderId);
              Alert.alert(
                "Payment Success!",
                `Payment completed successfully!\nOrder ID: ${data.orderId}`
              );
              // Handle successful payment in your React Native app
              // You can navigate to success screen, update state, etc.
            } else if (data.type === "payment_cancelled") {
              console.log("❌ Payment Cancelled in Mobile App");
              Alert.alert("Payment Cancelled", "Payment was cancelled by user");
              // Handle cancelled payment
            } else if (data.type === "payment_error") {
              console.log("❌ Payment Error in Mobile App:", data.error);
              Alert.alert("Payment Error", `Payment failed: ${data.error}`);
              // Handle payment error
            } else if (data.type === "status_update") {
              console.log("📱 Status Update:", data.message);
              // You can show toast messages or update UI based on status
            }
          } catch (_error) {
            console.log("WebView message:", event.nativeEvent.data);
          }
        }}
        onNavigationStateChange={(event) => {
          console.log("WebView Navigation:", event.url);
        }}
        onError={(error) => {
          console.error("WebView Error:", error);
        }}
        onHttpError={(error) => {
          console.error("WebView HTTP Error:", error);
        }}
        onLoadStart={() => {
          console.log("WebView: Started loading");
        }}
        onLoadEnd={() => {
          console.log("WebView: Finished loading");
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
