import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { images } from "@/assets/images/images";

const dashboard = () => {
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
      
      <View className="flex-1 justify-center items-center">
        <Image className="w-60 h-60 " source={images.reset_pwd} />
      </View>
    </LinearGradient>
  );
};

export default dashboard;

const styles = StyleSheet.create({});
