// frontend/app/upload-pdf.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import UploadPDF from "@/components/UploadPDF";
import { COLORS } from "@/constants/Colors";
import Layout from "@/components/Layout";

export default function UploadPDFScreen() {
  return (
    <Layout>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <UploadPDF />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});