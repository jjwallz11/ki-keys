import React, { useState, useEffect } from "react";
import { Platform, Text, View, Button, Alert, FlatList } from "react-native";
import { apiFetch } from "../utils/api";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthToken } from "../hooks/useAuthToken";

const useDocumentPicker = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const authToken = await useAuthToken();
      setToken(authToken);
    };
    getToken();
  }, []);

  if (Platform.OS === "web") {
    return async () => {
      const { getDocumentAsync } = await import("expo-document-picker");
      const res = await getDocumentAsync({ type: "application/pdf", copyToCacheDirectory: false });
      if (res.canceled || !res.assets || res.assets.length === 0) {
        throw new Error("No PDF selected");
      }
      return res.assets[0];
    };
  } else {
    const picker = require("react-native-document-picker").default;
    return async () => {
      return await picker.pickSingle({ type: picker.types.pdf });
    };
  }
};

export default function UploadPDF() {
  const pickPDF = useDocumentPicker();
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<
    { key_type: string; quantity: number; description: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  const handleUpload = async () => {
    try {
      const file = await pickPDF();
      setFileName(file.name || file.uri);
      console.log("📄 Selected PDF:", file);

      const formData = new FormData();

      if (Platform.OS === "web" && file.uri.startsWith("data:")) {
        const base64Data = file.uri.split(",")[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: file.mimeType || "application/pdf" });

        // ✅ Fix — wrap in File to include filename
        const fileObj = new File([blob], file.name || "receipt.pdf", {
          type: "application/pdf",
        });

        formData.append("file", fileObj);
      } else {
        // ✅ Mobile – proper format
        formData.append("file", {
          uri: file.uri,
          name: file.name || "receipt.pdf",
          type: file.mimeType || "application/pdf",
        } as any);
      }

      setLoading(true);
      const token = await useAuthToken();

      const result = await apiFetch(
        "http://127.0.0.1:8000/api/receipts/upload-pdf",
        {
          method: "POST",
          body: formData,
        },
        token || undefined
      );

      console.log("🧾 Extracted items:", result.items);
      setExtractedItems(result.items || []);
    } catch (err: any) {
      if (
        err.message !== "No PDF selected" &&
        err.code !== "DOCUMENT_PICKER_CANCELED"
      ) {
        console.error("❌ PDF Pick Error:", err);
        Alert.alert("Error", err.message || "Failed to pick PDF");
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmUpload = async () => {
    try {
      if (!extractedItems.length) return;
      const response = await apiFetch(
        "http://127.0.0.1:8000/api/inventory/bulk-add",
        {
          method: "POST",
          body: JSON.stringify({
            items: extractedItems.map(({ key_type, quantity }) => ({
              key_type,
              quantity,
            })),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Inventory Updated:", response);
      Alert.alert("Success", "Inventory updated!");
      setExtractedItems([]);
      setFileName(null);
    } catch (err) {
      console.error("❌ Confirm Upload Error:", err);
      Alert.alert("Error", "Failed to update inventory.");
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, backgroundColor: bgColor }}>
      <Text style={{ marginBottom: 10, color: textColor }}>
        Upload a PDF receipt
      </Text>
      <Button title="Pick PDF" onPress={handleUpload} />
      {fileName && (
        <Text style={{ marginTop: 10, color: textColor }}>
          ✅ PDF Picked: {fileName}
        </Text>
      )}
      {extractedItems.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "bold", color: textColor }}>
            Extracted Items:
          </Text>
          <FlatList
            data={extractedItems}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={{ color: textColor, marginBottom: 5 }}>
                {item.quantity} × {item.key_type.toUpperCase()} –{" "}
                {item.description}
              </Text>
            )}
          />
          <Button
            title="✅ Confirm & Add to Inventory"
            onPress={confirmUpload}
          />
        </View>
      )}
    </View>
  );
}