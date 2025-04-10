// frontend6/app/_layout.tsx
import { Stack } from "expo-router";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function Layout() {
  const colorScheme = useColorScheme();

  // This will redirect to /login if not authenticated
  useAuthRedirect();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}