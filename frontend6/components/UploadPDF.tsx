// frontend/app/components/UploadPDF.tsx
import React, { useState } from "react";

import { View, Text, Button, Alert } from "react-native";

import * as DocumentPicker from "expo-document-picker";

import { useThemeColor } from "@/hooks/useThemeColor";
import { apiFetch } from "@/utils/api";

export default function UploadPDF() {
  const [setSelectedFile] = useState<any>(null);
  const [parsedData, setParsedData] = useState<{ key_type: string; quantity: number }[] | null>(null);
  const [loading, setLoading] = useState(false);

  const textColor = useThemeColor({}, "text");

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;
    const file = result.assets?.[0];
    if (!file) return;

    setSelectedFile(file);
    uploadPDF(file);
  };

  const uploadPDF = async (file: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("pdf", {
        uri: file.uri,
        name: file.name,
        type: "application/pdf",
      } as any);

      const response = await apiFetch("/api/receipts/extract", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      setParsedData(response.items);
    } catch (error: any) {
      console.error("❌ PDF upload error:", error);
      Alert.alert("Error", "Failed to extract key data from PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!parsedData) return;

    try {
      await apiFetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });
      Alert.alert("Success", "Inventory updated successfully.");
      setParsedData(null);
      setSelectedFile(null);
    } catch (err) {
      console.error("❌ Confirm error:", err);
      Alert.alert("Error", "Failed to update inventory.");
    }
  };

  return (
    <View>
      {!parsedData ? (
        <>
          <Button title="Select PDF" onPress={handlePickDocument} />
          {loading && <Text style={{ color: textColor }}>Uploading...</Text>}
        </>
      ) : (
        <>
          <Text style={{ color: textColor, marginBottom: 10 }}>📄 Confirm Extracted Keys:</Text>
          {parsedData.map((item, index) => (
            <Text key={index} style={{ color: textColor }}>
              {item.quantity} × {item.key_type}
            </Text>
          ))}
          <Button title="Confirm and Update Inventory" onPress={handleConfirm} />
        </>
      )}
    </View>
  );
}