<template>
  <div>
    <b-row>
      <b-col v-for="(location,index) in filterField.locations" :key="index" sm="6" md="2" lg="2">
        <b-form-group   :id="location.name" :label="location.label" :label-for="location.name">
          <b-form-select
            :id="location.name"
            :name="location.name"
            v-model="filter[location.name]"
            placeholder=""
            :options="location.list"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <!-- <b-col sm="6" md="2" lg="2">
        <b-form-group
          id="location"
          label="Remote station"
          label-for="`location`"
        >
          <b-form-select
            @change="filterItems('location')"
            id="location"
            name="location"
            v-model="filter.location"
            placeholder=""
            :options="filterField.locations[1].list"
          ></b-form-select>
        </b-form-group>
      </b-col> -->

      <b-col sm="6" md="3" lg="3">
        <!-- label="Form-checkbox-group inline checkboxes (default)" -->
        <b-form-group v-slot="{ ariaDescribedby }">
          <b-form-checkbox-group
            @change="filterItems('states')"
            v-model="filter.states"
            :aria-describedby="ariaDescribedby"
            name="states"
            stacked
          >
            <!-- :options="listDisplay" -->
            <b-form-checkbox
              v-for="(display, index) in filterField.states"
              :key="index"
              :value="display.value"
            >
              <b-badge :variant="display.badge">{{
                display.text
              }}</b-badge></b-form-checkbox
            >
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>
      <b-col sm="6" md="4" lg="4">
        <b-form-group label="Date/time display" v-slot="{ ariaDescribedby }">
          <b-form-radio
            @change="filterItems('dateTime')"
            v-for="(item, index) in filterField.dateTimes"
            :key="index"
            v-model="filter.dateTime"
            :aria-describedby="ariaDescribedby"
            name="dateTime"
            :value="item.value"
            >{{ item.text }}</b-form-radio
          >
        </b-form-group>
      </b-col>
      <!-- <b-col sm="1" md="1" lg="1">
          <b-button variant="primary">
              <b-icon icon="arrow-repeat"></b-icon>
              Refresh
              </b-button>
      </b-col> -->
    </b-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';

export default defineComponent({
  props: {
    filter: {
      type: Object as PropType<{ text: string; location: string; local: string; states: string[]; dateTime: string }>,
      default: () => ({ text: "", location: "", local: "", states: [], dateTime: "local" }),
    },
    filterField: {
      type: Object as PropType<{ locations: any[]; states: any[]; dateTimes: any[] }>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const list = ref([
      { value: "", text: "All" },
      { value: "MyCompany", text: "MyCompany" },
      { value: "PartnerB", text: "PartnerB" },
      { value: "PartnerA", text: "PartnerA" },
    ]);

    const listDisplay = ref([
      { text: "Display ok", value: "ok", badge: "success", ab: "O" },
      { text: "Display pending", value: "pending", badge: "warning", ab: "P" },
      { text: "Display stop", value: "stop", badge: "danger", ab: "S" },
    ]);

    const listDateTime = ref([
      { text: "Local[America/Caracas; -04:00]", value: "local" },
      { text: "AS2 Server[Europe/Berlin; +02:00]", value: "server" },
    ]);

    const filterItems = (data: string) => {
      emit("filterItems", data);
    };

    return {
      list,
      listDisplay,
      listDateTime,
      filterItems,
    };
  },
});
</script>
