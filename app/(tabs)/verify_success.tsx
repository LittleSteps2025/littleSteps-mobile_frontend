import { images } from "@/assets/images/images";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

function verify_success() {
    
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
      <View className="flex-1 justify-center items-center mt-10">
        <Image className="w-80 h-80" source={images.verify_success} />
      </View>
      <View className="flex-1 justify-center items-center mx-10">
        <Text className="text-black font-extrabold text-3xl pt-5 text-center">
          Successfully verified
        </Text>
        <Text className="text-center pt-2 text-gray-700 px-4">
          Fill in your personal information to simplify the process.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/dashboard")}
          className="rounded-3xl py-4 items-center bg-purple-500 w-full mt-10 mx-10"
          style={{
            shadowColor: "#7c3aed",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text className="text-white text-lg font-semibold">
            Complete Parent Card
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

export default verify_success;
