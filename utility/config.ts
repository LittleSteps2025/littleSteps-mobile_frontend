 import { Platform } from "react-native";

export const API_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:5001"
    : "http://192.168.8.169:5001"; 

        //pramodiIp
   //     : "http://192.168.43.74:5001"; 