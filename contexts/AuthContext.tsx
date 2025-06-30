import React, { createContext, useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: firebase.User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
  parentData: ParentData | null;
  setParentData: (data: ParentData | null) => void;
}

interface ParentData {
  parentId: string;
  email: string;
  name: string;
  verified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [parentData, setParentData] = useState<ParentData | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setIsLoading(false);
      
      // Load parent data from AsyncStorage if user is signed in
      if (user) {
        try {
          const storedParentData = await AsyncStorage.getItem('parentData');
          if (storedParentData) {
            setParentData(JSON.parse(storedParentData));
          }
        } catch (error) {
          console.error('Error loading parent data:', error);
        }
      } else {
        setParentData(null);
        // Clear stored data when user signs out
        await AsyncStorage.removeItem('parentData');
      }
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await auth.signOut();
      setParentData(null);
      await AsyncStorage.removeItem('parentData');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const handleSetParentData = async (data: ParentData | null) => {
    setParentData(data);
    if (data) {
      try {
        await AsyncStorage.setItem('parentData', JSON.stringify(data));
      } catch (error) {
        console.error('Error storing parent data:', error);
      }
    } else {
      await AsyncStorage.removeItem('parentData');
    }
  };

  const value = {
    user,
    isLoading,
    isSignedIn: !!user,
    signOut,
    parentData,
    setParentData: handleSetParentData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
