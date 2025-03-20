import axios from 'axios';

const API_BASE_URL = 'http://localhost:2911/api/vehicles';

const getVehicleByVIN = async (vin, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${vin}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    throw error;
  }
};

export default { getVehicleByVIN };