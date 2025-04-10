// frontend/hooks/useAuthRedirect.ts
import { useEffect } from "react";

import { useRouter } from "expo-router";

import { getToken } from "@/utils/auth";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (!token) {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);
}