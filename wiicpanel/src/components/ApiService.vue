<script>
import axios from 'axios';

const BASE_URL = 'https://localhost:7005/api';

const ApiService = axios.create({
  baseURL: BASE_URL,
});

// Define ApiService functions
export const DeviceApiService = {
  async getAllDevices() {
    try {
      const response = await ApiService.get('/devices');
      return response.data;
    } catch (error) {
      throw new Error('Error fetching devices: ' + error.message);
    }
  },
};

export const DeviceLogApiService = {
  async getAllDeviceLogs() {
    try {
      const response = await ApiService.get('/devicelogs');
      return response.data;
    } catch (error) {
      throw new Error('Error fetching device logs: ' + error.message);
    }
  },
  async getDeviceLogs(deviceId) {
    try {
      const response = await ApiService.get(`/devicelogs/${deviceId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching device logs for device ${deviceId}: ` + error.message);
    }
  },
};

// Export the ApiService module
export default {
  DeviceApiService,
  DeviceLogApiService,
};
</script>