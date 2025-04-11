// frontend/app/home.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import UploadPDF from "@/components/UploadPDF";
import Layout from "@/components/Layout";
import { logout } from "@/utils/logout";

const tiles = [
  { label: "Invoices", emoji: "📄📄📄", route: "/invoices" },
  { label: "Inventory", emoji: "🔑🔑🔑", route: "/inventory" },
  { label: "Vehicles", emoji: "🚗🚙🚐", route: "/vehicles" },
  { label: "Companies", emoji: "🧑🏽‍💼🏢🚚", route: "/companies" },
  { label: "Profile", emoji: "👤", route: "/profile" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [showUploadPDF, setShowUploadPDF] = useState(false);

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Ready to Work?</Text>

        {!showUploadPDF ? (
          <View style={styles.tileSection}>
            <TouchableOpacity onPress={() => setShowUploadPDF(true)} style={styles.tile}>
              <Text style={styles.tileText}>📦 Upload Inventory PDF</Text>
            </TouchableOpacity>

            {tiles.map((tile) => (
              <TouchableOpacity key={tile.label} onPress={() => router.push(tile.route)} style={styles.tile}>
                <Text style={styles.tileText}>
                  {tile.emoji} {tile.label.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View>
            <UploadPDF />
            <TouchableOpacity onPress={() => setShowUploadPDF(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    color: "#072460",
    fontSize: 20,
    marginBottom: 16,
    fontWeight: "600",
  },
  tileSection: {
    gap: 12,
  },
  tile: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tileText: {
    fontSize: 16,
    color: "#000",
  },
  cancel: {
    marginTop: 10,
    fontSize: 16,
    color: "#AE2335",
  },
});