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
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import MlkitOcr from "react-native-mlkit-ocr";

import { COLORS } from "@/constants/Colors";
import Layout from "@/components/Layout";
import { apiFetch } from "@/utils/api";
import { parseVinFromText } from "@/utils/parseVinFromText";

export default function VinScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualVIN, setManualVIN] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState<{
    year: number;
    make: string;
    model: string;
  } | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");

  useEffect(() => {
    if (scanned) {
      const timeout = setTimeout(() => setScanned(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [scanned]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <Layout>
        <View style={styles.container}>
          <Text style={[styles.message, { color: COLORS.text }]}>
            We need your permission to show the camera.
          </Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      </Layout>
    );
  }

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
      const response = await apiFetch(`/api/vehicles/decode-vin/${vin}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      setVehicle(response);
      Alert.alert(
        "Vehicle Found",
        `${response.year} ${response.make} ${response.model}`
      );
    } catch (err: any) {
      console.error("❌ VIN Decode Error:", err);
      Alert.alert("Error", err.message || "Failed to decode VIN");
    } finally {
      setLoading(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const scanTextForVin = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      const uri = result.assets[0].uri;
      try {
        const ocrResults = await MlkitOcr.detectFromUri(uri);
        const text = ocrResults.map((r) => r.text).join(" ");
        const vin = parseVinFromText(text);

        if (vin) {
          decodeVIN(vin);
        } else {
          Alert.alert("VIN Not Found", "Try again with better lighting.");
        }
      } catch (err) {
        console.error("OCR Error:", err);
        Alert.alert("Error", "Failed to scan VIN from image.");
      }
    }
  };

  return (
    <Layout>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <Text style={[styles.title, { color: COLORS.text }]}>
          Scan or Enter VIN
        </Text>

        {showScanner ? (
          <CameraView
            style={styles.camera}
            facing={facing}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "code128", "code39", "ean13"],
            }}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.buttonText}>Flip Camera</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        ) : (
          <>
            <TextInput
              placeholder="Enter VIN manually"
              placeholderTextColor={COLORS.textSecondary}
              value={manualVIN}
              onChangeText={setManualVIN}
              autoCapitalize="characters"
              style={[
                styles.input,
                { color: COLORS.text, borderColor: COLORS.text },
              ]}
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

            <TouchableOpacity
              onPress={scanTextForVin}
              style={[styles.scanButton, { marginTop: 10 }]}
            >
              <Text style={{ color: COLORS.text, textAlign: "center" }}>
                📖 OCR Scan Text for VIN
              </Text>
            </TouchableOpacity>

            {vehicle && (
              <View style={styles.vehicleInfo}>
                <Text style={[styles.infoTitle, { color: COLORS.text }]}>
                  Vehicle Info:
                </Text>
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
  message: { textAlign: "center", paddingBottom: 10 },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});