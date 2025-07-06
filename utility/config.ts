 import { Platform } from "react-native";

export const API_BASE_URL =
Platform.OS === "web"
        ? "http://localhost:5001"
        //kavindu
    // : "http://192.168.114.156:5001"; // Replace with your real IP

        //pramodiIp
        : "http://192.168.43.74:5001"; 