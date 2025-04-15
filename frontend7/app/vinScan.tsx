// frontend/app/vinScan.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Camera, BarcodeScanningResult } from "expo-camera";
import { COLORS } from "@/constants/Colors";
import Layout from "@/components/Layout";
import { apiFetch } from "@/utils/api";

const ExpoCamera = Camera as unknown as React.ComponentType<any>;

export default function VinScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [manualVIN, setManualVIN] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState<{ year: number; make: string; model: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (scanned) {
      const timeout = setTimeout(() => setScanned(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [scanned]);

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
    <Layout>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <Text style={[styles.title, { color: COLORS.text }]}>Scan or Enter VIN</Text>

        {showScanner && hasPermission ? (
          <ExpoCamera
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["code128", "code39"],
            }}
            style={styles.camera}
          />
        ) : (
          <>
            <TextInput
              placeholder="Enter VIN manually"
              placeholderTextColor={COLORS.textSecondary}
              value={manualVIN}
              onChangeText={setManualVIN}
              autoCapitalize="characters"
              style={[styles.input, { color: COLORS.text, borderColor: COLORS.text }]}
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
              <Text style={{ color: COLORS.text, textAlign: "center" }}>
                📷 Scan VIN with Camera
              </Text>
            </TouchableOpacity>

            {vehicle && (
              <View style={styles.vehicleInfo}>
                <Text style={[styles.infoTitle, { color: COLORS.text }]}>Vehicle Info:</Text>
                <Text style={{ color: COLORS.text }}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </Layout>
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