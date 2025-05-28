// app/vinScan.tsx

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import VinScanner from '../components/VinScanner';
import { fetchVehicleByVin } from '../utils/api';

export default function VinScanScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVinDetected = async (vin: string) => {
    setLoading(true);
    setError(null);

    try {
      const vehicle = await fetchVehicleByVin(vin);
      router.push({ pathname: '/vehicle-result', params: { ...vehicle } });
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch vehicle data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.text}>Fetching vehicle data…</Text>
        </View>
      )}
      {!loading && <VinScanner onDetected={handleVinDetected} />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  text: {
    color: '#fff',
    marginTop: 10,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
});