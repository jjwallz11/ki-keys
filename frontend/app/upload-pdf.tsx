// frontend/app/upload-pdf.tsx
import { View } from "react-native";
import UploadPDF from "../components/UploadPDF";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

export default function UploadPDFScreen() {
  useAuthRedirect(); // 🔐 Route guard

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <UploadPDF />
    </View>
  );
}