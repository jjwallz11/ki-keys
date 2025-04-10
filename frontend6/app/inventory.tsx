// frontend/app/inventory.tsx
import React, { useEffect, useState } from "react";

import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { apiFetch } from "@/utils/api";

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const data = await apiFetch("http://192.168.1.89:8000/api/inventory", {
          method: "GET",
        });
        setInventory(data);
      } catch (err) {
        setError("Failed to load inventory");
        console.error("Inventory fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: bgColor }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: bgColor }}>
        <Text style={{ color: textColor }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <FlatList
        data={inventory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={{ color: textColor }}>{item.key_type} - {item.quantity}</Text>
            <Text style={{ color: textColor }}>Location: {item.location}</Text>
            <TouchableOpacity>
              <Text style={{ color: textColor }}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}