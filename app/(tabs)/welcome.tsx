import React, { useState } from "react";
import { Image, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { images } from "@/assets/images/images";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

function Welcome() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    }
  };

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
      <View className="flex-1 overflow-hidden">
        {/* Slides Container */}
        <View
          className="flex-row flex-1"
          style={{
            transform: [{ translateX: -currentSlide * width }],
          }}
        >
          {/* Slide 1 */}
          <View
            className="flex flex-col justify-center items-center p-6 mt-12"
            style={{ width: width }}
          >
            <Image source={images.child} className="mb-4" />
            <Text className="text-black font-extrabold text-3xl pt-5 text-center">
              ChildCare Made Easy
            </Text>
            <Text className="text-center pt-2 text-gray-700 px-4">
              Choose from a wide range of specialists and book appointments with
              ease. Personalized care is just a click away.
            </Text>
            <TouchableOpacity
              className="rounded-3xl py-4 items-center mb-8 bg-purple-500 w-full mt-10 mx-6"
              style={{
                shadowColor: "#7c3aed",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
              onPress={nextSlide}
            >
              <Text className="text-white text-lg font-semibold">Next</Text>
            </TouchableOpacity>
          </View>

          {/* Slide 2 */}
          <View
            className="flex flex-col justify-center items-center p-6 mt-10"
            style={{ width: width }}
          >
            <Image source={images.child} className="mb-4" />
            <Text className="text-black font-extrabold text-3xl pt-5 text-center">
              Here For You Always
            </Text>
            <Text className="text-center pt-2 text-gray-700 px-4">
              Get real-time updates, message teachers, and ensure your child&apos;s
              day is full of care and joy.
            </Text>
            <TouchableOpacity
              className="rounded-3xl py-4 items-center mb-8 bg-purple-500 w-full mt-10 mx-6"
              style={{
                shadowColor: "#7c3aed",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
              onPress={nextSlide}
            >
              <Text className="text-white text-lg font-semibold">
                Get Started
              </Text>
            </TouchableOpacity>
          </View>

          {/* Slide 3 */}
          <View
            className="flex flex-col justify-center items-center p-6 mt-10"
            style={{ width: width }}
          >
            <Image source={images.child} className="mb-4" />
            <Text className="text-black font-extrabold text-3xl pt-5 text-center">
              Welcome to LittleSteps
            </Text>
            <Text className="text-center pt-2 text-gray-700 px-4">
              Your journey to smart, connected, and stress-free childcare starts
              here.
            </Text>
            <TouchableOpacity
              className="rounded-3xl py-4 items-center bg-purple-500 w-full mt-10 mx-6"
              style={{
                shadowColor: "#7c3aed",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
              onPress={() => router.push("/signup")}
            >
              <Text className="text-white text-lg font-semibold">
                Create an Account
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              className="rounded-3xl py-4 items-center mb-8 bg-purple-100 w-full mt-5 mx-6"
              style={{
                shadowColor: "#7c3aed",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
              onPress={() => router.push("/signin")}
            >
              <Text className="text-purple-500 text-lg font-semibold">
                Log in
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Slide Indicators */}
        <View className="flex-row justify-center items-center pb-8">
          <View
            className={`w-10 h-2 rounded-full mx-1 ${currentSlide === 0 ? "bg-purple-500" : "bg-gray-300"}`}
          />
          <View
            className={`w-10 h-2 rounded-full mx-1 ${currentSlide === 1 ? "bg-purple-500" : "bg-gray-300"}`}
          />
          <View
            className={`w-10 h-2 rounded-full mx-1 ${currentSlide === 2 ? "bg-purple-500" : "bg-gray-300"}`}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

export default Welcome;
