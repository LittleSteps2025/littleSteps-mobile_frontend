import { Platform } from "react-native";

export const API_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:5001"
    : "http://192.168.43.54:5001"; // Replace with your real IP
