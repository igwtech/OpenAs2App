<template>
  <div id="partners">
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
      <h1 class="h2">Partners</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group mr-2">
          <b-button
            v-if="isPathPartnerList"
            @click="newObject()"
            variant="success"
            size="sm"
            >New</b-button
          >
          <!-- <button type="button" class="btn btn-sm btn-outline-secondary">Export</button> -->
        </div>
      </div>
    </div>
    <table-custom
      :loading="loadingTable"
      :items="items"
      :fields="fields"
      @deleteObject="deleteObject"
      @editObject="editObject"
    ></table-custom>
    <b-modal hide-footer :id="infoModal.id" :title="infoModal.title" ok-only @hidden="resetModal" no-close-on-esc no-close-on-backdrop >
      <form-custom
        v-if="infoModal.title"
        title="Partner Editor"
        :schema="schema"
        :model="item"
        @commit="saveObject"
        @revert="resetModal"
        :loading="loadingForm"
      >
      </form-custom>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import FormCustom from "./FormCustom";
import TableCustom from "./TableCustom";
import Utils from "../utils";
import Swal from "sweetalert2";
import _ from "lodash";

export default defineComponent({
  name: "PartnersAdmin",
  components: {
    FormCustom,
    TableCustom,
  },
  setup() {
    const breadcrumbs = ref([
      {
        text: "Dashboard",
        to: { name: "Dashboard" },
        active: false,
      },
      {
        text: "Partners",
        to: { name: "Partners" },
        active: true,
      },
    ]);

    const schema = ref({
      fields: [
        {
          type: "text",
          name: "name",
          label: "Partner ID",
          placeholder: "Trading Partner's Unique Key Name",
          _validate: {
            required: true,
          },
        },
        {
          type: "text",
          name: "as2_id",
          label: "AS2 ID",
          placeholder: "Trading Partner's AS2 ID",
          _validate: {
            required: true,
          },
        },
        {
          type: "email",
          name: "email",
          label: "Email",
          placeholder: "Trading Partner's Email Address",
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

    const fields = ref([
      {
        key: "key",
        label: "#",
        sortable: true,
        class: "text-center",
      },
      {
        key: "name",
        label: "Partner ID",
        sortable: true,
        class: "text-center",
      },
      { key: "actions", label: "Actions", class: "text-center" },
    ]);

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

    const loadingTable = ref(false);
    const loadingForm = ref(false);

    const isPathPartnerList = computed(() => {
      return this.$route.name == "Partners";
    });

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
      loadingTable.value = false;
      loadingForm.value = false;
    };

    const deleteObject = async (item: any) => {
      try {
        loadingTable.value = true;
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
                loadingTable.value = false;
                getList();
              })
              .catch((e) => {
                console.log("delete parner", e);
                Swal.fire("Error!", e, "error");
                loadingTable.value = false;
              });
          } else {
            loadingTable.value = false;
          }
        });
      } catch (e) {
        console.log(e);
        Swal.fire("Error!", e, "error");
        loadingTable.value = false;
      }
    };

    const newObject = () => {
      loadingTable.value = true;
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
      loadingTable.value = true;
      infoModal.value.title = "Edit partner";
      const newObj = getNewObject();
      const result = await Utils.Crud.getObject("partner", _item.key, newObj);
      item.value = Object.assign(item.value, result);
      this.$root.$emit("bv::show::modal", infoModal.value.id);
    };

    const getNewObject = () => {
      const obj: any = { _id: null };
      schema.value.fields.forEach((f) => (obj[f.name] = f.value));
      return obj;
    };

    const getList = async () => {
      items.value = await Utils.Crud.getList("partner").then((results) => {
        return _.map(results, (item, index) => {
          return {
            key: index,
            name: item,
            actions: {
              edit: { name: "Edit", show: true },
              delete: { name: "Delete", show: true },
            },
          };
        });
      });
    };

    const saveObject = async (data: any) => {
      loadingForm.value = true;
      try {
        await Utils.Crud.saveObject("partner", data).then(() => {
          loadingForm.value = false;
          loadingTable.value = false;
        });
        resetModal();
        await getList();
      } catch (e) {
        Swal.fire("Error!", e, "error");
        loadingForm.value = false;
      }
    };

    onMounted(async () => {
      const list = await Utils.Crud.getList("cert");
      schema.value.fields[3].list = _.map(list, (item) => {
        return { value: item, text: item };
      });
      await getList();
    });

    return {
      breadcrumbs,
      schema,
      fields,
      infoModal,
      items,
      item,
      loadingTable,
      loadingForm,
      isPathPartnerList,
      resetModal,
      deleteObject,
      newObject,
      editObject,
      getNewObject,
      getList,
      saveObject,
    };
  },
});
</script>
<style >
</style>
