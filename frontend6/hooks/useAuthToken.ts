// frontend/hooks/useAuthToken.ts
import { useEffect, useState } from "react";

import { getToken } from "@/utils/auth";

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken();
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  return token;
}