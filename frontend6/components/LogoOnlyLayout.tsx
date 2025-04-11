import React from "react";
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = {
  children: React.ReactNode;
};

export default function LogoOnlyLayout({ children }: Props) {
  const bgColor = useThemeColor({}, "background");

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bgColor }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.modal}>
        <Image
          source={{ uri: "/pkLogo.png" }}
          style={styles.logo}
        />
        <View style={styles.content}>{children}</View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 70,
    resizeMode: "contain",
    marginBottom: 20,
  },
  content: {
    width: "100%",
  },
});