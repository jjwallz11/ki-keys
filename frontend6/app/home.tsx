// frontend/app/index.tsx
import React, { useState } from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { useRouter } from "expo-router";

import UploadPDF from "@/components/UploadPDF";
import { useThemeColor } from "@/hooks/useThemeColor";
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
  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: bgColor }}>
      <Text style={{ color: textColor, fontSize: 24, marginBottom: 10 }}>
        Patriotic Keys
      </Text>
      <Text style={{ color: textColor, fontSize: 20, marginBottom: 20 }}>
        Ready to Work?
      </Text>

      {!showUploadPDF ? (
        <View>
          <TouchableOpacity onPress={() => setShowUploadPDF(true)}>
            <Text style={{ color: textColor, fontSize: 18 }}>📦 Upload Inventory PDF</Text>
          </TouchableOpacity>

          {tiles.map((tile) => (
            <TouchableOpacity key={tile.label} onPress={() => router.push(tile.route)}>
              <Text style={{ color: textColor, fontSize: 18 }}>
                {tile.emoji} {tile.label.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View>
          <UploadPDF />
          <TouchableOpacity onPress={() => setShowUploadPDF(false)}>
            <Text style={{ color: textColor, fontSize: 18, marginTop: 10 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={logout}>
        <Text style={{ color: textColor, marginTop: 40 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}