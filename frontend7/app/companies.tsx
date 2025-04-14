// frontend/app/companies.tsx
import React from "react";

import { View, Text, FlatList } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export default function CompaniesScreen() {
  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  const companies = [
    { id: 1, name: "Transponder Island", type: "Supplier" },
    { id: 2, name: "American Key Supply", type: "Supplier" },
    { id: 3, name: "Avis", type: "Client (Rental)" },
    { id: 4, name: "RSA", type: "Client (Repossession)" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={{ color: textColor }}>{item.name}</Text>
            <Text style={{ color: textColor }}>{item.type}</Text>
          </View>
        )}
      />
    </View>
  );
}