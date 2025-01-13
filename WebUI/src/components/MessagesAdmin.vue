<template>
  <div id="messages">
    <shadcn-breadcrumb v-if="isPathMessageList" :items="breadcrumbs"></shadcn-breadcrumb>
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
      <h1 class="h2">Messages</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group mr-2">
          <!-- @click="newObject()" -->
          <shadcn-button
            v-if="isPathMessageList"
            @click="getList()"
            variant="primary"
            size="sm"
          >
            <b-icon icon="arrow-repeat"></b-icon>
            Refresh</shadcn-button
          >
          <shadcn-button @click="exportPdf" variant="danger" size="sm">
            <shadcn-icon icon="file-earmark-pdf-fill"></shadcn-icon>
            Export</shadcn-button
          >
          <shadcn-button @click="exportExcel" variant="success" size="sm">
            <shadcn-icon icon="file-earmark-excel-fill"></shadcn-icon>
            Export</shadcn-button
          >
          <!-- <button type="button" class="btn btn-sm btn-outline-secondary">Export</button> -->
        </div>
      </div>
    </div>
    <filter-message-table
      :filter="filter"
      :filterField="filterField"
      @filterItems="filterItems"
    ></filter-message-table>
    <div id="table-message">
      <table-custom-message
        ref="table-messages"
        :items="getFilterItems"
        :fields="fields"
        :filter="filter"
        :stateMap="stateMap"
        :showFilter="showFilter"
        @deleteObject="deleteObject"
        @editObject="editObject"
        @showObject="showObject"
        ><div class="frame">
          <slot name="filter">Title</slot>
        </div>
      </table-custom-message>
    </div>
    <shadcn-modal hide-footer :id="infoModal.id" :title="infoModal.title" ok-only>
      <form-custom
        v-if="infoModal.title"
        title="Message Editor"
        :schema="schema"
        :model="item"
        @commit="saveObject"
        @revert="resetModal"
      >
      </form-custom>
    </shadcn-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import FormCustom from "./FormCustom.vue";
import TableCustomMessage from "./TableCustomMessage.vue";
import FilterMessageTable from "./FilterMessageTable.vue";
import Utils from "../utils";
import Swal from "sweetalert2";
import _ from "lodash";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import XLSX from "xlsx";

export default defineComponent({
  components: {
    FormCustom,
    TableCustomMessage,
    FilterMessageTable,
  },
  setup() {
    const breadcrumbs = ref([
      {
        text: "Dashboard",
        to: { name: "Dashboard" },
        active: false,
      },
      {
        text: "Messages",
        to: { name: "Messages" },
        active: true,
      },
    ]);

    const filter = ref({
      text: "",
      sender_id: "",
      receiver_id: "",
      states: ["ok", "pending", "stop"],
      dateTime: "America/Caracas",
    });

    const stateMap = ref({
      ok: [
        "msg_send_start",
        "msg_receive_start",
        "mdn_send_start",
        "mdn_receive_start",
        "msg_sent_mdn_received_ok",
        "msg_rxd_mdn_sent_ok",
        "msg_rxd_mdn_not_requested_ok",
        "msg_sent_mdn_received_mic_mismatch",
      ],
      pending: [
        "msg_send_exception",
        "msg_receive_exception",
        "mdn_sending_exception",
        "mdn_receiving_exception",
      ],
      stop: [
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

    const showFilter = ref(false);

    const filterField = ref({
      locations: [
        {
          type: "select",
          name: "sender_id",
          label: "Local station",
          list: [
            {
              value: "",
              text: "All",
            },
          ],
        },
        {
          type: "select",
          name: "receiver_id",
          label: "Remote station",
          list: [
            {
              value: "",
              text: "All",
            },
          ],
        },
      ],
      states: [
        {
          text: "Display ok",
          value: "ok",
          badge: "success",
          ab: "O",
        },
        {
          text: "Display pending",
          value: "pending",
          badge: "warning",
          ab: "P",
        },
        { text: "Display stop", value: "stop", badge: "danger", ab: "S" },
      ],
      dateTimes: [
        {
          type: "radio",
          text: "Local[America/Caracas; -04:00]",
          value: "America/Caracas",
        },
        {
          type: "radio",
          text: "AS2 Server[Europe/Berlin; +02:00]",
          value: "Europe/Berlin",
        },
      ],
    });

    const schema = ref({
      fields: [
        {
          key: "name",
          type: "text",
          name: "name",
          label: "Message ID",
          placeholder: "Trading Message's Unique Key Name",
          _validate: {
            required: true,
          },
        },
        {
          type: "text",
          name: "as2_id",
          label: "AS2 ID",
          placeholder: "Trading Message's AS2 ID",
          _validate: {
            required: true,
          },
        },
        {
          type: "email",
          name: "email",
          label: "Email",
          placeholder: "Trading Message's Email Address",
          _validate: {
            required: true,
            email: true,
          },
        },
        {
          type: "select",
          name: "x509_alias",
          label: "Certificate Alias",
          _validate: {
            required: true,
          },
          list: [] as any[],
        },
      ],
    });

    const infoModal = ref({
      id: "info-modal",
      title: "",
    });

    const items = ref<any[]>([]);

    const item = ref({
      _id: null,
      name: "",
      as2_id: "",
      email: "",
      x509_alias: "",
    });

    const isPathMessageList = computed(() => {
      return this.$route.name == "Messages";
    });

    const getFilterItems = computed(() => {
      let _list = items.value;
      if (filter.value.sender_id != "") {
        _list = _.filter(_list, (item) => {
          return item.sender_id == filter.value.sender_id;
        });
      }
      if (filter.value.receiver_id != "") {
        _list = _.filter(_list, (item) => {
          return item.receiver_id == filter.value.receiver_id;
        });
      }
      if (filter.value.states.length == 0) {
        _list = [];
      } else {
        let _list2: any[] = [];
        filter.value.states.forEach((display) => {
          let aux = _.filter(_list, (item) => {
            return (
              _.find(stateMap.value[display], (m) => {
                return item.state == m;
              }) && item
            );
          });
          _list2 = _.concat(_list2, aux);
        });
        _list = _list2;
      }
      return _list;
    });

    const fields = computed(() => [
      {
        key: "key",
        label: "#",
        sortable: true,
        class: "text-center",
        filter: false,
        export: true,
      },
      {
        key: "state",
        label: "Display",
        sortable: false,
        class: "text-center",
        filter: true,
        export: true,
      },
      {
        key: "create_dt",
        label: "Timestamp",
        sortable: true,
        class: "text-center",
        formatter: (value: any) => {
          return filter.value.dateTime == "America/Caracas"
            ? moment.tz(value, filter.value.dateTime).utc().format("YYYY-DD-MM H:mm:ss")
            : moment.tz(value, filter.value.dateTime).utc().format("YYYY-DD-MM H:mm:ss");
        },
        filter: true,
        export: true,
      },
      {
        key: "sender_id",
        label: "Local Location",
        sortable: true,
        class: "text-center",
        filter: true,
        export: true,
      },
      {
        key: "receiver_id",
        label: "Remote Location",
        sortable: true,
        class: "text-center",
        filter: true,
        export: true,
      },
      {
        key: "msg_id",
        label: "Message ID",
        sortable: true,
        class: "text-center",
        filter: false,
        export: true,
      },
      {
        key: "file_name",
        label: "Payload",
        sortable: true,
        class: "text-center",
        filter: false,
        export: true,
      },
      {
        key: "encryption_algorithm",
        label: "Encryption",
        sortable: true,
        class: "text-center",
        filter: false,
        export: true,
      },
      {
        key: "signature_algorithm",
        label: "Signature",
        sortable: true,
        class: "text-center",
        filter: false,
        export: true,
      },
      {
        key: "mdn_mode",
        label: "MDN",
        sortable: true,
        class: "text-center",
        filter: false,
        export: true,
      },
    ]);

    const exportExcel = () => {
      const fileName = "table-" + moment().format("YYYYMMDDH:mm:ss") + ".xlsx";
      let _items = _.map(getFilterItems.value, (_item) => {
        let obj: Record<string, any> = {};
        _.forIn(_item, function (value, key) {
          if (typeof _item[key] === "string") {
            obj[key] = value;
          }
        });
        return obj;
      });
      const ws = XLSX.utils.json_to_sheet(_items);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "output");
      XLSX.writeFile(wb, fileName);
    };

    const exportPdf = () => {
      const doc = new jsPDF({
        orientation: "landscape",
      });
      let head = _.map(
        _.filter(fields.value, (field) => field.export),
        (_field) => {
          return { header: _field.label, dataKey: _field.key };
        }
      );
      let body = _.map(getFilterItems.value, (item) => {
        return {
          key: item.key,
          state: item.state,
          create_dt: item.create_dt,
          sender_id: item.sender_id,
          receiver_id: item.receiver_id,
          msg_id: item.msg_id,
          file_name: item.file_name,
          encryption_algorithm: item.encryption_algorithm,
          signature_algorithm: item.signature_algorithm,
          mdn_mode: item.mdn_mode,
        };
      });

      autoTable(doc, {
        columnStyles: { 5: { halign: "center", cellWidth: 50 }, 6: { halign: "center", cellWidth: 40 } },
        columns: head,
        body: body,
      });
      doc.save("table-" + moment().format("YYYYMMDDH:mm:ss") + ".pdf");
    };

    const filterItems = (data: string) => {
      // Implement filter logic if needed
    };

    const resetModal = () => {
      infoModal.value.title = "";
      item.value = {
        _id: null,
        name: "",
        as2_id: "",
        email: "",
        x509_alias: "",
      };
      this.$root.$emit("bv::hide::modal", infoModal.value.id);
    };

    const deleteObject = async (item: any) => {
      try {
        Swal.fire({
          title: "Are you sure to delete?",
          html: `a partner  ${item.name}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then(async (result) => {
          if (result.isConfirmed) {
            Utils.Crud.deleteObject("partner", item.key)
              .then(() => {
                Swal.fire("Deleted!", "", "success");
                getList();
              })
              .catch((e) => {
                console.log("delete parner", e);
                Swal.fire("Error!", e, "error");
              });
          }
        });
      } catch (e) {
        console.log(e);
        Swal.fire("Error!", e, "error");
      }
    };

    const newObject = () => {
      infoModal.value.title = "New partner";
      item.value = {
        _id: null,
        name: "",
        as2_id: "",
        email: "",
        x509_alias: "",
      };
      this.$root.$emit("bv::show::modal", infoModal.value.id);
    };

    const editObject = async (_item: any) => {
      infoModal.value.title = "Message Edit";
      const newObj = getNewObject();
      const result = await Utils.Crud.getObject("partner", _item.key, newObj);
      item.value = Object.assign(item.value, result);
      this.$root.$emit("bv::show::modal", infoModal.value.id);
    };

    const showObject = async (_item: any) => {
      this.$router.push({ name: "MessageDetail", params: { id: _item.key } });
    };

    const getNewObject = () => {
      const obj: any = { _id: null };
      schema.value.fields.forEach((f) => (obj[f.name] = f.value));
      return obj;
    };

    const getList = async () => {
      items.value = await Utils.Crud.getList("messages").then((results) => {
        return _.map(results, (item, index) => {
          return {
            key: index,
            id: item.ID,
            state: item.STATE,
            create_dt: item.CREATE_DT,
            sender_id: item.SENDER_ID,
            receiver_id: item.RECEIVER_ID,
            msg_id: item.MSG_ID,
            file_name: item.FILE_NAME,
            encryption_algorithm: item.ENCRYPTION_ALGORITHM
              ? item.ENCRYPTION_ALGORITHM
              : "Unknown",
            signature_algorithm: item.SIGNATURE_ALGORITHM
              ? item.SIGNATURE_ALGORITHM
              : "Unknown",
            mdn_mode: item.MDN_MODE,
          };
        });
      });
    };

    const getListPartners = async () => {
      let list = _.map(await Utils.Crud.getList("partner"), (item) => {
        return { value: item, text: item };
      });
      let _list = _.concat(filterField.value.locations[0].list, list);

      filterField.value.locations[0].list = _list;
      filterField.value.locations[1].list = _list;
    };

    const saveObject = async (data: any) => {
      try {
        await Utils.Crud.saveObject("partner", data);
        resetModal();
        await getList();
      } catch (e) {
        Swal.fire("Error!", e, "error");
      }
    };

    onMounted(async () => {
      const list = await Utils.Crud.getList("cert");
      schema.value.fields[3].list = _.map(list, (item) => {
        return { value: item, text: item };
      });
      await getList();
      await getListPartners();
    });

    return {
      breadcrumbs,
      filter,
      stateMap,
      showFilter,
      filterField,
      schema,
      infoModal,
      items,
      item,
      isPathMessageList,
      getFilterItems,
      fields,
      exportExcel,
      exportPdf,
      filterItems,
      resetModal,
      deleteObject,
      newObject,
      editObject,
      showObject,
      getNewObject,
      getList,
      getListPartners,
      saveObject,
    };
  },
});
</script>
<style >
</style>
