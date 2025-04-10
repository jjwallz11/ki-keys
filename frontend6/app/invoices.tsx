// frontend/app/invoices.tsx
import React, { useEffect, useState } from "react";

import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { apiFetch } from "@/utils/api";

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const data = await apiFetch("http://192.168.1.89:8000/api/invoices", {
          method: "GET",
        });
        setInvoices(data);
      } catch (err) {
        setError("Failed to load invoices");
        console.error("Invoice fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
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
        data={invoices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={{ color: textColor }}>
              Invoice #{item.number} - {item.date}
            </Text>
            <Text style={{ color: textColor }}>
              Total Due: ${item.total_due}
            </Text>
            <TouchableOpacity>
              <Text style={{ color: textColor }}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}