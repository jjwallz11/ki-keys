// utils/api.ts

import { API_BASE_URL } from '../config/env';
import { getStoredToken } from './auth';

export async function fetchVehicleByVin(vin: string) {
  const token = await getStoredToken();

  const res = await fetch(`${API_BASE_URL}/api/vehicles/${vin}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to fetch vehicle.');
  }

  return res.json();
}