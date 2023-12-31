<template>
  <div class="line-chart-container">
    <h2>Temperature History</h2>
    <canvas ref="lineChartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';

// Register Chart.js plugins
Chart.register(...registerables);

export default {
  props: {
    temperatureData: Array, // Temperature data from App.vue
    timeLabels: Array, // Time labels from App.vue
    deviceName: String, // Name of the selected device
    deviceId: String, // Add this prop to receive deviceId
  },
  setup(props) {
    const lineChartCanvas = ref(null);
    let chart = null; // Define chart variable
    console.log('Time Labels:', props.timeLabels);

    let temperatureDataComputed = computed(() => {
      return props.temperatureData.map((temperature) => temperature / 100);
    });

    onMounted(() => {
      const ctx = lineChartCanvas.value;

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: generateTimeLabels(props.timeLabels), // Use the time labels formatted with generateTimeLabels
          datasets: [
            {
              label: 'Temperature',
              data: temperatureDataComputed.value, // Use the temperatureData prop
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Temperature (°C)',
              },
            },
          },
        },
      });
    });

    // Watch for changes in temperatureData prop
    watch(() => [props.temperatureData, props.timeLabels], ([newTemperatureData, newTimeLabels]) => {
      temperatureDataComputed.value = newTemperatureData.map((temperature) => temperature / 100);
      // Check if chart is defined before updating
      if (chart) {
        chart.data.labels = generateTimeLabels(newTimeLabels); // Update the labels with formatted time labels
        chart.data.datasets[0].data = temperatureDataComputed.value;
        chart.update();
      }
    });

    function generateTimeLabels(data) {
      return data.map((timestamp) => {
        const time = new Date(timestamp);
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      });
    }

    return {
      lineChartCanvas,
    };
  },
};
</script>
