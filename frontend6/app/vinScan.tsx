// frontend/app/vinScan.tsx
import React, { useEffect, useState } from "react";

import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";

import { BarCodeScanner } from "expo-barcode-scanner";

import { useThemeColor } from "@/hooks/useThemeColor";
import { apiFetch } from "@/utils/api";

export default function VinScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [manualVIN, setManualVIN] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState<{ year: number; make: string; model: string } | null>(null);

  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    requestPermission();
  }, []);

  useEffect(() => {
    if (scanned) {
      const timeout = setTimeout(() => setScanned(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [scanned]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setShowScanner(false);
    decodeVIN(data);
  };

  const decodeVIN = async (vin: string) => {
    if (!vin || vin.length < 11) {
      Alert.alert("Invalid VIN", "Please enter or scan a valid VIN");
      return;
    }

    try {
      setLoading(true);
      const response = await apiFetch("/api/vehicles/decode-vin", {
        method: "POST",
        body: JSON.stringify({ vin }),
        headers: { "Content-Type": "application/json" },
      });
      setVehicle(response);
      Alert.alert("Vehicle Found", `${response.year} ${response.make} ${response.model}`);
    } catch (err: any) {
      console.error("❌ VIN Decode Error:", err);
      Alert.alert("Error", err.message || "Failed to decode VIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: bgColor }}>
      <Text style={{ color: textColor, fontSize: 18, marginBottom: 10 }}>Scan or Enter VIN</Text>

      {showScanner && hasPermission ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ flex: 1 }}
        />
      ) : (
        <>
          <TextInput
            placeholder="Enter VIN manually"
            placeholderTextColor={textColor}
            value={manualVIN}
            onChangeText={setManualVIN}
            autoCapitalize="characters"
            style={{ borderWidth: 1, padding: 10, color: textColor, marginBottom: 12 }}
          />
          <Button
            title={loading ? "Decoding..." : "Submit VIN"}
            onPress={() => decodeVIN(manualVIN)}
            disabled={loading}
          />
          <TouchableOpacity
            onPress={() => {
              setShowScanner(true);
              setScanned(false);
            }}
            style={{ marginTop: 20 }}
          >
            <Text style={{ color: textColor, textAlign: "center" }}>📷 Scan VIN with Camera</Text>
          </TouchableOpacity>

          {vehicle && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: textColor, fontSize: 16, fontWeight: "bold" }}>Vehicle Info:</Text>
              <Text style={{ color: textColor }}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}