import { removeToken } from "./auth";
import { router } from "expo-router";

export async function logout() {
  await removeToken();
  router.replace("/login");
}