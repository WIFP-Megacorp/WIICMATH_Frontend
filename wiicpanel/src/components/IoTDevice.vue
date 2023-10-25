<template>
  <div class="iot-device">
    <button class="iot-button" @click="selectDevice">
      <h3>{{ deviceId }}</h3>
      <h4>{{ currentTemperature }}°C </h4>
      <h4>{{ currentHumidity }}% </h4>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    deviceName: String,
    deviceId: String, // Add this prop to receive deviceId
    deviceLogs: Array, // Add this prop to receive device logs
  },
  data() {
    return {
      currentTemperature: 0,
      currentHumidity: 0,
    };
  },
  watch: {
    deviceLogs: {
      deep: true, // Watch for changes in the array elements
      handler(newLogs) {
        if (Array.isArray(newLogs) && newLogs.length > 0) {
          const mostRecentLog = newLogs[newLogs.length - 1];
          this.currentTemperature = mostRecentLog.temperature / 100;
          this.currentHumidity = mostRecentLog.humidity / 100;
        } else {
          // Handle the case where there are no logs
          this.currentTemperature = 0;
          this.currentHumidity = 0;
        }
      },
    },
  },
  methods: {
    selectDevice() {
      // Pass both deviceName and deviceId when emitting the select-device event
      this.$emit("select-device", { deviceName: this.deviceName, deviceId: this.deviceId });
    },
  },
};
</script>
