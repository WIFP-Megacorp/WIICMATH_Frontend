<template>
  <div class="dashboard">
    <div class="iot-container">
      <h1>IoT Device Dashboard</h1>
      <div class="boxes-container">
        <div class="iot-boxes">
          <div class="iot-box" v-for="(device, index) in devices" :key="index">
            <IoTDevice
              :deviceId="device.ardMAC"
              :deviceName="device.name"
              :deviceLogs="device.logs"
              @select-device="handleDeviceSelect"
            />
          </div>
        </div>
        <button class="scan-button">Add Devices</button>
      </div>
    </div>
    <div class="history-container">
      <div class="history-box">
        <TemperatureHistory
          v-if="selectedDeviceName && selectedDeviceTemperatureData"
          :temperatureData="selectedDeviceTemperatureData"
          :deviceName="selectedDeviceName"
        />
        <h1 v-else>Select a device to display temperature and humidity history.</h1>
      </div>
      <div class="history-box">
        <HumidityHistory
          v-if="selectedDeviceName && selectedDeviceHumidityData"
          :humidityData="selectedDeviceHumidityData"
          :deviceName="selectedDeviceName"
        />
      </div>
    </div>
  </div>
</template>

<script>
import IoTDevice from "@/components/IoTDevice.vue";
import TemperatureHistory from "@/components/TemperatureHistory.vue";
import HumidityHistory from "@/components/HumidityHistory.vue";
import ApiService from "@/components/ApiService.vue";

export default {
  data() {
    return {
      devices: [],
      selectedDeviceName: "",
    };
  },
  computed: {
    selectedDevice() {
      return this.devices.find((device) => device.name === this.selectedDeviceName);
    },
    selectedDeviceTemperatureData() {
      return this.selectedDevice?.logs?.map((log) => log.temperature) || [];
    },
    selectedDeviceHumidityData() {
      return this.selectedDevice?.logs?.map((log) => log.humidity) || [];
    },
  },
  methods: {
    async handleDeviceSelect(selectedDevice) {
      this.selectedDeviceName = selectedDevice;
    },
    async fetchDevices() {
      try {
        // Make an API call to fetch devices
        const devices = await ApiService.DeviceApiService.getAllDevices();
        this.devices = devices;

        // Fetch the latest temperature and humidity data for each device
        for (const device of this.devices) {
          await this.fetchDeviceData(device);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    },
    async fetchDeviceData(device) {
      try {
        const logs = await ApiService.DeviceLogApiService.getDeviceLogs(device.ardMAC); // Use ardMAC

        if (logs.length > 0) {
          // Assign the logs to the device
          device.logs = logs;

          // Update the selected device's temperature and humidity data
          if (device.name === this.selectedDeviceName) {
            this.selectedDeviceTemperatureData = logs.map((log) => log.temperature);
            this.selectedDeviceHumidityData = logs.map((log) => log.humidity);
          }

          console.log("Logs for " + device.ardMAC + ":", logs);
        } else {
          // Handle the case where no logs exist for the device
          device.logs = [];
        }
      } catch (error) {
        console.error("Error fetching device data for " + device.ardMAC + ":", error);
      }
    },
    latestTemperature(device) {
      if (device.logs && device.logs.length > 0) {
        const mostRecentLog = device.logs[device.logs.length - 1];
        return mostRecentLog.temperature || 0;
      }
      return 0;
    },
    latestHumidity(device) {
      if (device.logs && device.logs.length > 0) {
        const mostRecentLog = device.logs[device.logs.length - 1];
        return mostRecentLog.humidity || 0;
      }
      return 0;
    },
    startDataRefreshInterval() {
      this.fetchDevices(); // Fetch data immediately

      // Set an interval to fetch data every 5 seconds (adjust the interval as needed)
      this.dataRefreshInterval = setInterval(() => {
        this.fetchDevices();
      }, 5000); // 5 seconds in milliseconds
    },
  },
  created() {
    this.startDataRefreshInterval(); // Start the data refresh interval when the component is created
  },
  beforeUnmount() {
    clearInterval(this.dataRefreshInterval); // Clear the interval when the component is unmounted
  },
  components: {
    IoTDevice,
    TemperatureHistory,
    HumidityHistory,
  },
};
</script>