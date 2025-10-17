import { UserProvider } from "@/contexts/UserContext";
import "@/global.css";
import { Stack } from "expo-router";
import { setupFCM } from "../fcm";
import { useEffect } from "react";
import Constants from "expo-constants";
import { suppressReactWarnings } from "@/utility/consoleUtils";

// Suppress React warnings
suppressReactWarnings();

export default function RootLayout() {
  useEffect(() => {
    // Check if we're in Expo Go
    const isExpoGo = Constants.executionEnvironment === "storeClient";

    if (isExpoGo) {
      console.log("App: Running in Expo Go - FCM disabled");
    } else {
      console.log("App: Running in development build - enabling FCM");
      // Setup FCM listeners (token registration happens on login)
      setupFCM();
    }
  }, []);

  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </UserProvider>
  );
}
