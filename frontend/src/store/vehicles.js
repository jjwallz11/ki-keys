import axios from 'axios';

const API_URL = "https://your-backend.com/api/vehicles/";

const fetchVehicleDetails = async (vin) => {
    try {
        const response = await axios.get(`${API_URL}${vin}`);
        console.log("Vehicle Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching vehicle data:", error.response?.data || error.message);
        return null;
    }
};

// Example usage after scanning a VIN
const scannedVin = "1HGCM82633A123456"; // Example VIN from scanner
fetchVehicleDetails(scannedVin);