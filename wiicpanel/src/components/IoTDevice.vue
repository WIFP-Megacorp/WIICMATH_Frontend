<template>
  <div class="iot-device">
    <h3>{{ deviceName }}</h3>
    <p>Current Temperature: {{ currentTemperature }}°C</p>
    <p>Humidity: {{ currentHumidity }}%</p>
    <button class="iot-button" @click="selectDevice">Select</button>
  </div>
</template>
  
<script>
export default {
  props: {
    deviceName: String,
    currentTemperature: Number, // Add this prop
    currentHumidity: Number, // Add this prop
  },
  methods: {
    selectDevice() {
      this.$emit("select-device", this.deviceName);
    },
  },
};
</script>