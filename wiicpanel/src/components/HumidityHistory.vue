<template>
  <div class="line-chart-container">
    <canvas ref="lineChartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

// Register Chart.js plugins
Chart.register(...registerables);

export default {
  props: {
    humidityData: Array, // Humidity data from App.vue
    deviceName: String, // Name of the selected device
  },
  setup(props) {
    const lineChartCanvas = ref(null);
    let chart = null; // Define chart variable

    onMounted(() => {
      const ctx = lineChartCanvas.value;

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [], // Initialize with empty labels
          datasets: [
            {
              label: 'Humidity',
              data: props.humidityData, // Use the humidityData prop
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
                text: 'Humidity (%)',
              },
            },
          },
        },
      });
    });

    // Watch for changes in humidityData prop
    watch(() => props.humidityData, (newData) => {
      // Check if chart is defined before updating
      if (chart) {
        chart.data.labels = generateTimeLabels(newData);
        chart.data.datasets[0].data = newData;
        chart.update();
      }
    });

    function generateTimeLabels(data) {
      return data.map((log) => {
        const time = new Date(log.timeStamp);
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
