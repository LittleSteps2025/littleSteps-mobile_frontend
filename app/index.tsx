import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 bg-red-200 items-center justify-center" >
      <Text className="font-bold text-5xl">WelCome</Text>
      <Link href="/dashboard">Dashboard</Link>
    </View>
  );
}
