
<template>
  <div>
    <b-row>
      <template>
        <!-- <pre>{{items}}</pre> -->
        <!-- <b-col sm="12" lg="12" md="12" class="my-3">
          <b-form-group
            label="Filter"
            label-for="filter-input"
            label-cols-sm="1"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input
                id="filter-input"
                v-model="filter.text"
                type="search"
                placeholder="Type to Search"
              ></b-form-input>

              <b-input-group-append>
                <b-button :disabled="!filter.text" @click="filter.text = ''"
                  >Clear</b-button
                >
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col> -->
        <b-col sm="12" md="4" class="my-1">
          <b-form-group
            label="Per page"
            label-for="per-page-select"
            label-cols-sm="6"
            label-cols-md="5"
            label-cols-lg="4"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
          >
            <b-form-select
              id="per-page-select"
              v-model="perPage"
              :options="pageOptions"
              size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>

        <b-col sm="12" md="8" class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="this.filteredItems.length"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-col>
      </template>
    </b-row>
    <b-table
     responsive
      :items="filteredItems"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter.text"
      :filter-included-fields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      stacked="md"
      show-empty
      small
      @filtered="onFiltered"
    >
      <template #cell(state)="row">
        <b-badge v-if="stateMap['ok'].includes(row.item.state)" variant="success">O</b-badge>
        <b-badge v-if="stateMap['pending'].includes(row.item.state)" variant="warning">P</b-badge>
        <b-badge v-if="stateMap['stop'].includes(row.item.state)" variant="danger">S</b-badge>
      </template>
      <template #cell(actions)="row">
        <b-button
          v-if="row.item.actions.edit ? row.item.actions.edit.show : false"
          variant="primary"
          size="sm"
          @click="editItem(row.item)"
          class="mr-1"
        >
          {{ row.item.actions.edit ? row.item.actions.edit.name : "Edit" }}
        </b-button>
        <b-button
          v-if="row.item.actions.delete ? row.item.actions.delete.show : false"
          variant="danger"
          @click="deleteItem(row.item)"
          size="sm"
        >
          {{
            row.item.actions.delete ? row.item.actions.delete.name : "Delete"
          }}
        </b-button>
        <b-button
          v-if="row.item.actions.show ? row.item.actions.show.show : false"
          variant="secondary"
          size="sm"
          @click="showItem(row.item)"
          class="mr-1"
        >
          {{ row.item.actions.show ? row.item.actions.show.name : "Show" }}
        </b-button>
      </template>
    </b-table>
    <b-row> </b-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, onMounted } from 'vue';
import momenttz from 'moment-timezone';

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<any[]>,
      required: true,
    },
    fields: {
      type: Array as PropType<any[]>,
      required: true,
    },
    showFilter: {
      type: Boolean,
      default: true,
    },
    filter: {
      type: Object as PropType<{ text: string }>,
      default: () => ({ text: "" }),
    },
    stateMap: {
      type: Object as PropType<Record<string, string[]>>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const totalRows = ref(1);
    const currentPage = ref(1);
    const perPage = ref(10);
    const pageOptions = ref([10, 25, 50, { value: 100, text: "Show a lot" }]);
    const sortBy = ref("key");
    const sortDesc = ref(false);
    const sortDirection = ref("asc");
    const filterOn = ref<string[]>([]);
    const selectVal = ref<Record<string, string>>({
      key: "",
      state: "",
      timestamp: "",
      location: "",
      message: "",
      payload: "",
      encryption: "",
      signature: "",
      mdn: "",
    });

    const filteredItems = computed(() => {
      return props.items.filter((item) => {
        let keep = true;
        props.fields.forEach((key) => {
          keep =
            keep &&
            (selectVal.value[key] === undefined ||
              item[key] === selectVal.value[key]);
        });
        return keep;
      });
    });

    const options = computed(() => {
      const options: Record<string, any[]> = {};
      props.fields.forEach((key) => {
        const vals = props.items.map((item) => item[key]);
        options[key] = Array.from(new Set(vals));
      });
      return options;
    });

    const showTime = (create_dt: string) => {
      return momenttz.tz(create_dt, "America/New_York");
    };

    const editItem = (item: any) => {
      emit("editObject", item);
    };

    const showItem = (item: any) => {
      emit("showObject", item);
    };

    const deleteItem = (item: any) => {
      emit("deleteObject", item);
    };

    const onFiltered = (filteredItems: any[]) => {
      totalRows.value = filteredItems.length;
      currentPage.value = 1;
    };

    onMounted(() => {
      totalRows.value = filteredItems.value.length;
    });

    return {
      totalRows,
      currentPage,
      perPage,
      pageOptions,
      sortBy,
      sortDesc,
      sortDirection,
      filterOn,
      selectVal,
      filteredItems,
      options,
      showTime,
      editItem,
      showItem,
      deleteItem,
      onFiltered,
    };
  },
});
</script>
