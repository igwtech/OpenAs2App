<template>
  <div id="dashboard">
    <shadcn-breadcrumb :items="breadcrumbs"></shadcn-breadcrumb>

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
    <shadcn-row>
      <!-- <b-card-group deck> -->
      <shadcn-col md="4">
        <shadcn-card
          bg-variant="warning"
          text-variant="white"
          header="Total Partners"
          class="text-center mt-1"
        >
          <shadcn-card-text>
            <shadcn-row align-h="between">
              <shadcn-col> <shadcn-icon icon="person" font-scale="3 "></shadcn-icon></shadcn-col>
              <shadcn-col>
                <h1>{{ countPartners }}</h1></shadcn-col>
            </shadcn-row>
          </shadcn-card-text>
        </shadcn-card>
      </shadcn-col>
      <shadcn-col md="4">
        <shadcn-card
          bg-variant="dark"
          text-variant="white"
          header="Total Connections"
          class="text-center mt-1"
        >
          <shadcn-card-text>
            <shadcn-row align-h="between">
              <shadcn-col> <shadcn-icon icon="people" font-scale="3 "></shadcn-icon></shadcn-col>
              <shadcn-col>
                <h1>{{ countPartnerships }}</h1></shadcn-col>
            </shadcn-row>
          </shadcn-card-text>
        </shadcn-card>
      </shadcn-col>
      <shadcn-col md="4">
        <shadcn-card
          bg-variant="info"
          text-variant="white" 
          header="Total Certificates"
          class="text-center mt-1"
        >
          <shadcn-card-text>
            <shadcn-row align-h="between">
              <shadcn-col> <shadcn-icon icon="file-earmark-richtext" font-scale="3 "></shadcn-icon></shadcn-col>
              <shadcn-col>
                <h1>{{countCertificates  }}</h1></shadcn-col>
            </shadcn-row>
          </shadcn-card-text>
        </shadcn-card>
      </shadcn-col>
      <!-- </b-card-group> -->
      <shadcn-row class="justify-content-md-center mt-3">
        <shadcn-col md="4">
          <shadcn-date-range-picker
            @update="changeDate"
            v-model="dateRange"
            opens="left"
          ></shadcn-date-range-picker>
        </shadcn-col>
      </shadcn-row>
      <!-- <b-col class="mt-3" :md="length < 15 ? '6' : '12'">
        <chart-line-two
          :labels="dates"
          :messagesSent="messagesSent"
          :messagesReceived="messagesReceived"
          :messagesFailed="messagesFailed"
        >
        </chart-line-two>
      </b-col> -->
      <shadcn-col class="mt-3" :md="dataChart['sent'].valuesX.length < 15 ? '6' : '12'">
        <chart-line
          :labels="dataChart['sent'].valuesX"
          :datasets="allState"
        >
        </chart-line>
      </shadcn-col>
      <shadcn-col
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
      </shadcn-col>
      <messages-admin></messages-admin>
    </shadcn-row>
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
