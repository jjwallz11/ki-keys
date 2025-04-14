// frontend/app/vinScan.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
// Import Camera and the new event type from expo-camera:
import { Camera, BarcodeScanningResult } from "expo-camera";
import { useThemeColor } from "@/hooks/useThemeColor";
import { apiFetch } from "@/utils/api";

// Uncomment and use this if TypeScript still complains about Camera as a JSX element:
const ExpoCamera = Camera as unknown as React.ComponentType<any>;

export default function VinScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [manualVIN, setManualVIN] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState<{ year: number; make: string; model: string } | null>(null);

  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  // Request camera permissions on mount.
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Reset the scanned state after a short delay.
  useEffect(() => {
    if (scanned) {
      const timeout = setTimeout(() => setScanned(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [scanned]);

  // Use the correct event type for the callback.
  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
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
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Scan or Enter VIN</Text>

      {showScanner && hasPermission ? (
        // If TypeScript complains about <Camera>, try replacing it with <ExpoCamera> as shown above.
        <ExpoCamera
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          // Use the new prop with string identifiers for barcode types.
          barcodeScannerSettings={{
            barcodeTypes: ["code128", "code39"],
          }}
          style={styles.camera}
        />
      ) : (
        <>
          <TextInput
            placeholder="Enter VIN manually"
            placeholderTextColor={textColor}
            value={manualVIN}
            onChangeText={setManualVIN}
            autoCapitalize="characters"
            style={[styles.input, { color: textColor, borderColor: textColor }]}
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
            style={styles.scanButton}
          >
            <Text style={{ color: textColor, textAlign: "center" }}>
              📷 Scan VIN with Camera
            </Text>
          </TouchableOpacity>

          {vehicle && (
            <View style={styles.vehicleInfo}>
              <Text style={[styles.infoTitle, { color: textColor }]}>Vehicle Info:</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 12, borderRadius: 4 },
  scanButton: { marginTop: 20 },
  vehicleInfo: { marginTop: 20 },
  camera: { flex: 1, borderRadius: 8 },
  infoTitle: { fontSize: 16, fontWeight: "bold" },
});