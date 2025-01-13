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
