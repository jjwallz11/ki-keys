// frontend/app/profile.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "@/constants/Colors";
import Layout from "@/components/Layout";
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

  return (
    <Layout>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        {loading ? (
          <ActivityIndicator />
        ) : user ? (
          <>
            <Button title="Logout" onPress={logout} />
            <Text style={[styles.text, { marginTop: 20 }]}>
              Name: {user.first_name} {user.last_name}
            </Text>
            <Text style={styles.text}>Email: {user.email}</Text>
            <Text style={styles.text}>Role: {user.role}</Text>
          </>
        ) : (
          <Text style={styles.text}>Failed to load user data</Text>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  text: { color: COLORS.text },
});