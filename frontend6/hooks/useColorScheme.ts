// frontend6/hooks/useColorScheme.ts
import { useColorScheme as _useColorScheme } from "react-native";

/**
 * Use the system color scheme ('light' | 'dark')
 */
export function useColorScheme(): "light" | "dark" {
  const theme = _useColorScheme();
  return theme === "dark" ? "dark" : "light";
}