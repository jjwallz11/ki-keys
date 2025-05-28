// components/VinScanner.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Vibration,
} from 'react-native';
import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import MLKitOcr from 'react-native-mlkit-ocr';
import { extractVinFromText } from '../utils/vinUtils';

type Props = {
  onDetected: (vin: string) => void;
};

export default function VinScanner({ onDetected }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isScanning, setIsScanning] = useState(true);
  const [cameraRef, setCameraRef] = useState<any>(null);

  // Automatically start scanning
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (permission?.granted && isScanning && cameraRef) {
      interval = setInterval(scanFrame, 1500);
    }
    return () => clearInterval(interval);
  }, [permission, isScanning, cameraRef]);

  const scanFrame = async () => {
    try {
      const photo = await cameraRef.takePhotoAsync({ skipMetadata: true });

      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { base64: true }
      );

      const ocrResults = await MLKitOcr.detectFromUri(manipulated.uri);
      const allText = ocrResults.map((block) => block.text).join(' ');
      const vin = extractVinFromText(allText);

      if (vin) {
        Vibration.vibrate(100);
        setIsScanning(false);
        onDetected(vin);
      }
    } catch (err) {
      console.error('VIN OCR Error:', err);
    }
  };

  if (!permission) return <ActivityIndicator />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((facing) => (facing === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={(ref) => setCameraRef(ref)}
      >
        <View style={styles.overlay}>
          <Text style={styles.text}>Scanning for VIN...</Text>
          <TouchableOpacity onPress={toggleCameraFacing} style={styles.button}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    margin: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#072460',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});