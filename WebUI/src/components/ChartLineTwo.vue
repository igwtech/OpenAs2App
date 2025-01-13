
<template>
  <div>
    <Highcharts :options="options" />
    <!-- <Highstock :options="options" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';

export default defineComponent({
  props: {
    messagesSent: {
      type: Array as PropType<number[]>,
      required: true,
    },
    messagesReceived: {
      type: Array as PropType<number[]>,
      required: true,
    },
    messagesFailed: {
      type: Array as PropType<number[]>,
      required: true,
    },
    labels: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  setup(props) {
    const options = computed(() => ({
      title: {
        text: "Number of messages per day",
        x: -20, //center
      },
      xAxis: {
        categories: props.labels,
      },
      yAxis: {
        title: {
          text: "Number Message",
        },
        plotLines: [
          {
            value: 0,
            width: 1,
            color: "#808080",
          },
        ],
      },
      tooltip: {
        valueSuffix: "",
      },
      colors: ["#28a745", "#007bff", "#FF0000"],
      series: [
        {
          name: "Sent messages ",
          data: props.messagesSent,
        },
        {
          name: "Received messages",
          data: props.messagesReceived,
        },
        {
          name: "Failed messages",
          data: props.messagesFailed,
        },
      ],
    }));

    return {
      options,
    };
  },
});
</script>
