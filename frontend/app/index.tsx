import React from 'react';
import { View, Text } from 'react-native';
import UploadPDF from '../components/UploadPDF';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>📦 PDF to Inventory</Text>
      <UploadPDF />
    </View>
  );
}