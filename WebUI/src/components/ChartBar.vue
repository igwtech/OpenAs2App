
<template>
<div>
  <Bar
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
</div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import 'chart.js/auto';
import { Bar } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default defineComponent({
  name: "BarChart",
  components: {
    Bar,
  },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
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
    color: {
      type: String,
      default: "#f87979",
    },
    labels: {
      type: Array as () => string[],
      required: true,
    },
    datasets: {
      type: Array as () => any[],
      required: true,
    },
    title: {
      type: String,
      default: "title ",
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
