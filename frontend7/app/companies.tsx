import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import { COLORS } from "@/constants/Colors";
import Layout from "@/components/Layout";

export default function CompaniesScreen() {
  const companies = [
    { id: 1, name: "Transponder Island", type: "Supplier" },
    { id: 2, name: "American Key Supply", type: "Supplier" },
    { id: 3, name: "Avis", type: "Client (Rental)" },
    { id: 4, name: "RSA", type: "Client (Repossession)" },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.itemText, { color: COLORS.text }]}>{item.name}</Text>
      <Text style={[styles.subText, { color: COLORS.textSecondary }]}>{item.type}</Text>
    </View>
  );

  return (
    <Layout>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <FlatList
          data={companies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
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
});