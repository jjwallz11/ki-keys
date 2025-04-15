import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { COLORS } from "@/constants/Colors";
import { apiFetch } from "@/utils/api";
import Layout from "@/components/Layout";

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const data = await apiFetch("/api/inventory", { method: "GET" });
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

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.itemText, { color: COLORS.text }]}>
        {item.key_type} - {item.quantity}
      </Text>
      <Text style={[styles.subText, { color: COLORS.textSecondary }]}>
        Location: {item.location}
      </Text>
      <TouchableOpacity>
        <Text style={[styles.viewLink, { color: COLORS.textSecondary }]}>
          View Details
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Layout>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <Text style={[styles.errorText, { color: COLORS.textSecondary }]}>
            {error}
          </Text>
        ) : (
          <FlatList
            data={inventory}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.tile,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    marginTop: 4,
    fontSize: 14,
  },
  viewLink: {
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
});