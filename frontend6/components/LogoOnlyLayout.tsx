import React from "react";
import { View, Image } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = {
  children: React.ReactNode;
};

export default function LogoOnlyLayout({ children }: Props) {
  const bgColor = useThemeColor({}, "background");

  return (
    <View style={{ flex: 1, backgroundColor: bgColor, alignItems: "center", paddingTop: 40 }}>
      <Image
        source={{ uri: "/pkLogo.png" }}
        style={{ width: 180, height: 80, resizeMode: "contain", marginBottom: 20 }}
      />
      <View style={{ width: "100%", paddingHorizontal: 20 }}>{children}</View>
    </View>
  );
}