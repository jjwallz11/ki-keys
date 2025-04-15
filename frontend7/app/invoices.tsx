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
import Layout from "@/components/Layout";
import { apiFetch } from "@/utils/api";

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const data = await apiFetch("/api/invoices");
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

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.itemText, { color: COLORS.text }]}>
        Invoice #{item.number} - {item.date}
      </Text>
      <Text style={[styles.subText, { color: COLORS.textSecondary }]}>
        Total Due: ${item.total_due}
      </Text>
      <TouchableOpacity>
        <Text style={[styles.viewLink, { color: COLORS.textSecondary }]}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Layout>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <Text style={[styles.errorText, { color: COLORS.text }]}>{error}</Text>
        ) : (
          <FlatList
            data={invoices}
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
  container: { flex: 1, padding: 16 },
  listContent: { paddingBottom: 20 },
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