 import { Platform } from "react-native";

export const API_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:5001"


  //  : "http://192.168.163.156:5001"; // Replace with your real IP

    //wifi
   // : "http://192.168.8.169:5001";

    //vivo
      : "http://192.168.43.237:5001";
    

        //pramodiIp


       //  : "http://10.47.127.74:5001"; 


