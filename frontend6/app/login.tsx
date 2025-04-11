// frontend6/app/login.tsx
import React, { useState } from "react";
import { Text, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";

import { useThemeColor } from "@/hooks/useThemeColor";
import { setToken } from "@/utils/auth";
import { apiFetch } from "@/utils/api";
import LogoOnlyLayout from "@/components/LogoOnlyLayout";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const response = await apiFetch("/api/session/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      await setToken(response.access_token);
      router.replace("/home");
    } catch (err: any) {
      console.error("Login Error:", err);
      Alert.alert("Login Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LogoOnlyLayout>
      <Text style={{ color: textColor, fontSize: 18, marginBottom: 10 }}>
        Login
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={"gray"}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          padding: 10,
          color: "black",
          marginBottom: 10,
        }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={"gray"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          padding: 10,
          color: "black",
          marginBottom: 10,
        }}
      />

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
    </LogoOnlyLayout>
  );
}
