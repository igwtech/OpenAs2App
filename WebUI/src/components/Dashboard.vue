<template>
  <div id="dashboard">
    <b-breadcrumb :items="breadcrumbs"></b-breadcrumb>

    <div
      class="
        d-flex
        justify-content-between
        flex-wrap flex-md-nowrap
        align-items-center
        pt-3
        pb-2
        mb-3
        border-bottom
      "
    >

      <h1 class="h2">Dashboard</h1>
    </div>
    <b-row>
      <!-- <b-card-group deck> -->
      <b-col md="4">
        <b-card
          bg-variant="warning"
          text-variant="white"
          header="Total Partners"
          class="text-center mt-1"
        >
          <b-card-text
            > <b-row align-h="between">
              <b-col> <b-icon icon="person" font-scale="3 "></b-icon></b-col>
              <b-col>
                <h1>{{ countPartners }}</h1></b-col
              >
            </b-row></b-card-text
          >
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card
          bg-variant="dark"
          text-variant="white"
          header="Total Connections"
          class="text-center mt-1"
        >
          <b-card-text>
            <b-row align-h="between">
              <b-col> <b-icon icon="people" font-scale="3 "></b-icon></b-col>
              <b-col>
                <h1>{{ countPartnerships }}</h1></b-col
              >
            </b-row>
          </b-card-text>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card
          bg-variant="info"
          text-variant="white" 
          header="Total Certificates"
          class="text-center mt-1"
        >
          <b-card-text
            >
            <b-row align-h="between">
              <b-col> <b-icon icon="file-earmark-richtext" font-scale="3 "></b-icon></b-col>
              <b-col>
                <h1>{{countCertificates  }}</h1></b-col
              >
            </b-row>
            </b-card-text
          >
        </b-card>
      </b-col>
      <!-- </b-card-group> -->
      <b-row class="justify-content-md-center mt-3">
        <b-col md="4">
          <date-range-picker
            @update="changeDate"
            v-model="dateRange"
            opens="left"
          ></date-range-picker>
        </b-col>
      </b-row>
      <!-- <b-col class="mt-3" :md="length < 15 ? '6' : '12'">
        <chart-line-two
          :labels="dates"
          :messagesSent="messagesSent"
          :messagesReceived="messagesReceived"
          :messagesFailed="messagesFailed"
        >
        </chart-line-two>
      </b-col> -->
      <b-col class="mt-3" :md="dataChart['sent'].valuesX.length < 15 ? '6' : '12'">
        <chart-line
          :labels="dataChart['sent'].valuesX"
          :datasets="allState"
        >
        </chart-line>
      </b-col>
      <b-col
        v-for="(state, index) in states"
        :key="index"
        class="mt-3"
        :md="dataChart[state].valuesX.length < 15 ? '6' : '12'"
      >
        <chart-bar
          :labels="dataChart[state].valuesX"
          :datasets="dataChart[state].valuesY"
          :title="dataChart[state].valuesX.label"
        >
        </chart-bar>
      </b-col>
      <messages-admin></messages-admin>
    </b-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import ChartLine from "./ChartLine.vue";
import MessagesAdmin from "./MessagesAdmin.vue";
import ChartBar from "./ChartBar";
import Utils from "../utils";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import moment from "moment";
import _ from "lodash";

export default defineComponent({
  name: "dashboard",
  components: {
    ChartLine,
    MessagesAdmin,
    ChartBar,
    DateRangePicker,
  },
  setup() {
    const breadcrumbs = ref([
      {
        text: "Dashboard",
        to: { name: "Dashboard" },
        active: true,
      },
    ]);

    const messages = ref({
      sent: [] as any[],
      receive: [] as any[],
      fail: [] as any[],
    });

    const dataChart = ref({
      sent: {
        valuesX: [] as string[],
        valuesY: [
          {
            label: "Sent messages",
            backgroundColor: "#28a745",
            borderColor: "#28a745",
            data: [] as number[],
          },
        ],
      },
      receive: {
        valuesX: [] as string[],
        valuesY: [
          {
            label: "Received messages",
            backgroundColor: "#007bff",
            borderColor: "#007bff",
            data: [] as number[],
          },
        ],
      },
      fail: {
        valuesX: [] as string[],
        valuesY: [
          {
            label: "Failed messages",
            backgroundColor: "#FF0000",
            borderColor: "#FF0000",
            data: [] as number[],
          },
        ],
      },
    });

    const partners = ref<any[]>([]);
    const certificates = ref<any[]>([]);
    const partnerships = ref<any[]>([]);
    const dateRange = ref({
      startDate: moment().startOf("week"),
      endDate: moment(),
    });

    const states = ref(["sent", "receive", "fail"]);
    const stateMap = ref({
      sent: [
        "msg_send_start",
        "mdn_send_start",
        "msg_rxd_mdn_sent_ok",
        "msg_rxd_mdn_not_requested_ok",
      ],
      receive: [
        "msg_sent_mdn_received_mic_mismatch",
        "msg_sent_mdn_received_ok",
        "msg_receive_start",
        "mdn_receive_start",
      ],
      fail: [
        "msg_send_exception",
        "msg_receive_exception",
        "mdn_sending_exception",
        "mdn_receiving_exception",
        "msg_send_fail",
        "msg_send_fail_resend_queued",
        "msg_receive_fail",
        "msg_rxd_asyn_mdn_send_fail_resend_queued",
        "mdn_asyn_receive_fail",
        "msg_rxd_mdn_sending_fail",
        "msg_receive_error_sending_mdn_error",
        "msg_sent_mdn_received_error",
      ],
    });

    const countPartners = computed(() => partners.value.length);
    const countCertificates = computed(() => certificates.value.length);
    const countPartnerships = computed(() => partnerships.value.length);

    const allState = computed(() => {
      return states.value.map((state) => dataChart.value[state].valuesY[0]);
    });

    const getListPartners = async () => {
      partners.value = await Utils.Crud.getList("partner");
    };

    const getListCertificates = async () => {
      certificates.value = await Utils.Crud.getList("cert");
    };

    const getListConnections = async () => {
      partnerships.value = await Utils.Crud.getList("partnership");
    };

    const getListMessageChart = async () => {
      const data = {
        startDate: moment(dateRange.value.startDate).format("YYYY-MM-DD"),
        endDate: moment(dateRange.value.endDate).format("YYYY-MM-DD"),
      };
      let messagesData = await Utils.Crud.getListChart("messages", data);
      messagesData.forEach((message: any) => {
        states.value.forEach((state) => {
          if (stateMap.value[state].includes(message.STATE)) {
            messages.value[state].push({
              date: moment(message.CREATE_DT).format("YYYY-MM-DD"),
              name: message.MSG_ID,
            });
          }
        });
      });
      let ini = moment(data.startDate);
      let end = moment(data.endDate);
      while (ini.isBefore(end)) {
        let inicio = ini.format("YYYY-MM-DD");
        states.value.forEach((state) => {
          dataChart.value[state].valuesX.push(inicio);
          let filter = _.filter(messages.value[state], (msg) => {
            return moment(msg.date).format("YYYY-MM-DD") == inicio;
          });
          let count = filter.length > 0 ? filter.length : 0;
          dataChart.value[state].valuesY[0].data.push(count);
        });
        ini.add(1, "days");
      }
    };

    const changeDate = () => {
      getListMessageChart();
    };

    onMounted(() => {
      getListPartners();
      getListCertificates();
      getListConnections();
      getListMessageChart();
    });

    return {
      breadcrumbs,
      messages,
      dataChart,
      partners,
      certificates,
      partnerships,
      dateRange,
      states,
      stateMap,
      countPartners,
      countCertificates,
      countPartnerships,
      allState,
      changeDate,
    };
  },
});
</script>
<style scoped>
/*
 * Content
 */

[role="main"] {
  padding-top: 133px; /* Space for fixed navbar */
}

.v-text-field {
  padding: 0;
}

.fixWidth {
  max-width: 180px;
}

.selectableWidth {
  max-width: 200px;
}

@media (min-width: 768px) {
  [role="main"] {
    padding-top: 48px; /* Space for fixed navbar */
  }
}
</style>
