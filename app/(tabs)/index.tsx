import {useRouter } from "expo-router";
import { Image, View } from "react-native";
import {images} from '@/assets/images/images'
import {LinearGradient} from "expo-linear-gradient";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Using router.push() to navigate to dashboard
      router.push('/welcome');
      // or use router.replace('/dashboard') if you don't want user to go back
    },5000); // 5000ms = 5 seconds

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, [router]);
  return (
    <LinearGradient
      colors={['#581c87', '#3b0764', '#000000']}
      start={[0, 0]}
      end={[0, 1]}
      className="flex-1 justify-center"
    >
      <View className="items-center " >
        
        <Image source={images.logo}/>
        <Image source={images.littlesteps}/>
        <Image source={images.whreeCareBegin}/>
    
      </View>
    </LinearGradient>
  );
  
}
