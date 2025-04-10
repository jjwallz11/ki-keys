// frontend/app/index.tsx
import React from "react";

import { View, Button, Text } from "react-native";

import { useRouter } from "expo-router";

import { useThemeColor } from "@/hooks/useThemeColor";

export default function HomeScreen() {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: 12, padding: 20, backgroundColor: bgColor }}>
      <Text style={{ color: textColor, fontSize: 24, textAlign: "center" }}>Home</Text>
      <Button title="Ready to Work" onPress={() => router.push("/upload-pdf")} />
      <Button title="Scan VIN" onPress={() => router.push("/vinScan")} />
      <Button title="Inventory" onPress={() => router.push("/inventory")} />
      <Button title="Invoices" onPress={() => router.push("/invoices")} />
      <Button title="Companies" onPress={() => router.push("/companies")} />
      <Button title="Profile" onPress={() => router.push("/profile")} />
    </View>
  );
}