// fcm.js
import { Platform, PermissionsAndroid } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Call at app start
export async function setupFCM() {
  try {
    // Check if we're in Expo Go (FCM won't work in Expo Go)
    const isExpoGo = Constants.executionEnvironment === "storeClient";

    if (isExpoGo) {
      console.log(
        "FCM: Skipping setup in Expo Go. Use development build for FCM."
      );
      return null;
    }

    console.log("FCM: Setting up Firebase Cloud Messaging...");

    // Dynamically import Firebase messaging to avoid initialization issues
    const { default: messaging } = await import(
      "@react-native-firebase/messaging"
    );

    // On Android 13+ we need runtime 'POST_NOTIFICATIONS' permission
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("FCM: Notification permission denied");
        return null;
      }
    }

    // Request permission (iOS will ask user)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log("FCM: Push permission not granted");
      return null;
    }

    // Get FCM token (this is the raw FCM device token)
    const fcmToken = await messaging().getToken();
    console.log("FCM: Token obtained:", fcmToken);

    // Subscribe to token refresh
    messaging().onTokenRefresh(async (token) => {
      console.log("FCM: Token refreshed:", token);
      // Update token in backend if user is logged in
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.id) {
            await registerFCMToken(parseInt(userData.id), token);
            console.log(
              "FCM: Refreshed token registered for user:",
              userData.id
            );
          }
        }
      } catch (error) {
        console.error("FCM: Error registering refreshed token:", error);
      }
    });

    // Listen for incoming messages
    messaging().onMessage(async (remoteMessage) => {
      console.log("FCM: Message received:", remoteMessage);
      // Handle foreground messages here
    });

    return fcmToken;
  } catch (error) {
    console.warn("FCM: Setup failed:", error.message);
    console.warn(
      "FCM: Make sure you're using a development build, not Expo Go"
    );
    return null;
  }
}

// Function to register FCM token with backend
export async function registerFCMToken(userId, fcmToken) {
  try {
    console.log("FCM: Registering token for user:", userId);

    const { API_BASE_URL } = await import("./utility/config");
    const response = await fetch(`${API_BASE_URL}/api/update-fcm-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        fcmToken: fcmToken,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("FCM: Token registered successfully:", result);
      return true;
    } else {
      const error = await response.json();
      console.error("FCM: Failed to register token:", error);
      return false;
    }
  } catch (error) {
    console.error("FCM: Error registering token:", error);
    return false;
  }
}
