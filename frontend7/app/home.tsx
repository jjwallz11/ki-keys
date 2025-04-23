import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Layout from "@/components/Layout";

const tiles = [
  { label: "Inventory", emoji: "🔑 📄 💍", route: "/inventory" },
  { label: "Invoices", emoji: "📄📄📄", route: "/invoices" },
  { label: "Add Keys", emoji: "🔑🔑🔑", route: "/upload-pdf" },
  { label: "Vin Scan", emoji: "🚗🚙🚐", route: "/vinScan" },
  { label: "Companies", emoji: "🧑🏽‍💼🏢🚚", route: "/companies" },
  { label: "Profile", emoji: "👤", route: "/profile" },
] as const;

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {tiles.map((tile) => (
            <TouchableOpacity
              key={tile.label}
              onPress={() => router.push(tile.route)}
              style={styles.tile}
            >
              <Text style={styles.label}>{tile.label.toUpperCase()}</Text>
              <Text style={styles.emoji}>{tile.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  grid: {
    width: "100%",
    maxWidth: 900,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 24,
    columnGap: 24,
  },
  tile: {
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    width: Dimensions.get("window").width > 768 ? 260 : "45%",
    aspectRatio: 1.2,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#072460",
    marginBottom: 12,
    textAlign: "center",
  },
  emoji: {
    fontSize: 28,
    textAlign: "center",
  },
});