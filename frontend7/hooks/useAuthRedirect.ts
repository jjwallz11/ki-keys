// frontend6/hooks/useAuthRedirect.ts
import { useEffect } from "react";
import { useRouter, usePathname } from "expo-router";
import { getToken } from "@/utils/auth";

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      console.log("🔐 Token:", token, "| Path:", pathname);

      // ✅ Only redirect if NOT on /login
      if (!token && pathname !== "/login") {
        console.log("🔁 Redirecting to /login");
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router, pathname]);
}