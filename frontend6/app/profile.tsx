import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { apiFetch } from "@/utils/api";
import { logout } from "@/utils/logout";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiFetch("/api/session/current");
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: bgColor }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: bgColor }}>
        <Text style={{ color: textColor }}>Failed to load user data</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: bgColor }}>
      <Button title="Logout" onPress={logout} />
      <Text style={{ color: textColor, marginTop: 20 }}>Name: {user.first_name} {user.last_name}</Text>
      <Text style={{ color: textColor }}>Email: {user.email}</Text>
      <Text style={{ color: textColor }}>Role: {user.role}</Text>
    </View>
  );
}