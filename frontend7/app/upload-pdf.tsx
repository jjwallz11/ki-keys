import React from "react";

import { View } from "react-native";

import UploadPDF from "@/components/UploadPDF";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function UploadPDFScreen() {
  const bgColor = useThemeColor({}, "background");

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: bgColor }}>
      <UploadPDF />
    </View>
  );
}