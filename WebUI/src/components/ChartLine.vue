<template>
  <LineChartGenerator
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import 'chart.js/auto';
import { Line as LineChartGenerator } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default defineComponent({
  name: "LineChart",
  components: {
    LineChartGenerator,
  },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    labels: {
      type: Array as () => string[],
      required: true,
    },
    datasets: {
      type: Array as () => any[],
      required: true,
    },
  },
  setup(props) {
    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
    }));

    const chartData = computed(() => ({
      labels: props.labels,
      datasets: props.datasets,
    }));

    return {
      chartOptions,
      chartData,
    };
  },
});
</script>

