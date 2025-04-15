// frontend/app/index.tsx
import React, { useEffect, useState } from "react";
import { View, Button, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "@/constants/Colors";

export default function HomeScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Replace 'token' with the key you're using to store your auth token
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          // If token doesn't exist, redirect to the login page.
          router.replace("/login");
        } else {
          // Token exists, so allow rendering the home screen.
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth token:", error);
        // In case of error, decide how you want to proceed. You might
        // also want to route to login.
        router.replace("/login");
      }
    }
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.text} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        gap: 12,
        padding: 20,
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ color: COLORS.text, fontSize: 24, textAlign: "center" }}>
        Index.tsx
      </Text>
      <Button title="Ready to Work" onPress={() => router.push("/upload-pdf")} />
      <Button title="Scan VIN" onPress={() => router.push("/vinScan")} />
      <Button title="Inventory" onPress={() => router.push("/inventory")} />
      <Button title="Invoices" onPress={() => router.push("/invoices")} />
      <Button title="Companies" onPress={() => router.push("/companies")} />
      <Button title="Profile" onPress={() => router.push("/profile")} />
    </View>
  );
}