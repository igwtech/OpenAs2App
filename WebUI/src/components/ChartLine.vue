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

<script>
import 'chart.js/auto';
import { Line as LineChartGenerator } from "vue-chartjs";
import moment from "moment";
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

export default {
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
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    labels: {
      type: Array,
    },
    datasets:{
      type:Array
    }
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  setup() {
    return {
      chartData: {
        labels: this.labels,
        datasets: this.datasets,
      },
      getRandomArbitrary() {
        let numbers = [];
        let min = 1;
        let max = 100;
        for (let index = 0; index < 30; index++) {
          numbers.push(Math.round(Math.random() * (max - min) + min));
        }
        return numbers;
      },
      getRandomArbitrary2() {
        let numbers = [];
        let min = 1;
        let max = 100;
        for (let index = 0; index < 30; index++) {
          numbers.push(Math.round(Math.random() * (max - min) + min));
        }
        return numbers;
      },
      getRandomArbitrary3() {
        let numbers = [];
        let min = 1;
        let max = 100;
        for (let index = 0; index < 30; index++) {
          numbers.push(Math.round(Math.random() * (max - min) + min));
        }
        console.log("numbers", numbers);
        return numbers;
      },
      categories() {
        let dates = [];
        let monthly = Math.random() * (12 - 1) + 1;
        for (let index = 1; index < 31; index++) {
          dates.push(moment(`2022/04/${index}`).format("YYYY/MM/DD"));
        }
        return dates;
      },
    };
  },
};
</script>

