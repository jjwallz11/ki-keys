// frontend/App.tsx
import { ExpoRoot } from "expo-router";
import { registerRootComponent } from "expo";

// 👇 Correct for Expo Router v3 (not v4+)
const ctx = require("./app");

export function App() {
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);