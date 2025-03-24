// frontend/app/login.tsx
import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { apiFetch } from "../utils/api";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  const handleLogin = async () => {
    try {
      const res = await apiFetch("http://127.0.0.1:8000/api/session/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const { access_token } = res;
      if (!access_token) throw new Error("Missing token");

      // Store token based on platform
      if (Platform.OS === "web") {
        localStorage.setItem("token", access_token);
      } else {
        await SecureStore.setItemAsync("token", access_token);
      }

      router.push("/upload-pdf");
    } catch (err: any) {
      console.error("Login error:", err);
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center", backgroundColor: bgColor }}>
      <Text style={{ fontSize: 18, marginBottom: 10, color: textColor }}>Login</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor={textColor}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 10,
          padding: 8,
          color: textColor,
        }}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={textColor}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 20,
          padding: 8,
          color: textColor,
        }}
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
}