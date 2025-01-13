<template>
  <div id="certificates">
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
      <h1 class="h2">Certificates</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group mr-2">
          <shadcn-button
            v-if="isPathPartnerList"
            @click="newObject()"
            variant="success"
            size="sm"
            >New</shadcn-button
          >
          <!-- <button type="button" class="btn btn-sm btn-outline-secondary">Export</button> -->
        </div>
      </div>
    </div>
    <template v-if="$route.params.id">
      <certificate-editor
        v-if="$route.params.id"
        title="Certificate Editor"
        :schema="schema"
        :model="getObject($route.params.id)"
        @commit="saveObject"
        @delete="(id) => this.deleteObject(id)"
        @revert="resetModal"
      >
      </certificate-editor>
    </template>

    <template v-else>
      <table-custom
        :loading="loadingTable"
        :items="items"
        :fields="fields"
        @deleteObject="deleteObject"
        @editObject="editObject"
      ></table-custom>
      <shadcn-modal
        hide-footer
        :id="infoModal.id"
        :title="infoModal.title"
        ok-only
        @hidden="resetModal"
        no-close-on-esc
        no-close-on-backdrop
      >
        <form-custom
          :loading="loadingForm"
          v-if="infoModal.title"
          title="Partner Editor"
          :schema="schema"
          :model="item"
          @commit="saveObject"
          @revert="resetModal"
          @fileUpload="fileUpload"
        >
        </form-custom>
      </shadcn-modal>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import FormCustom from "./FormCustom.vue";
import TableCustom from "./TableCustom.vue";
import CertificateEditor from "./CertificateEditor.vue";
import Utils from "../utils";
import Swal from "sweetalert2";
import _ from "lodash";

export default defineComponent({
  name: "CertificatesAdmin",
  components: {
    FormCustom,
    TableCustom,
    CertificateEditor,
  },
  setup() {
    const breadcrumbs = ref([
      {
        text: "Dashboard",
        to: { name: "Dashboard" },
        active: false,
      },
      {
        text: "Certificates",
        to: { name: "Certificates" },
        active: true,
      },
    ]);

    const schema = ref({
      fields: [
        {
          type: "text",
          name: "alias",
          label: "Alias Name",
          placeholder: "Certificate's Alias Name",
          _validate: {
            required: true,
          },
        },
        {
          type: "text",
          name: "serial",
          label: "Serial Number (HEX)",
          placeholder: "Trading Partner's Email Address",
          show: true,
          disabled: true,
          _validate: {
            email: true,
          },
        },
        {
          type: "datepicker",
          name: "validNotBefore",
          label: "Valid Not Before",
          placeholder: "Valid Not Before",
          show: true,
          disabled: true,
          _validate: {},
        },
        {
          type: "datepicker",
          name: "validNotAfter",
          label: "Expiration Date",
          placeholder: "Expiration Date",
          show: true,
          disabled: true,
          _validate: {},
        },
        {
          type: "text",
          name: "subject",
          label: "Subject",
          placeholder: "Subject",
          disabled: true,
          show: true,
          _validate: {},
        },
        {
          type: "text",
          name: "fingerPrint",
          label: "Fingerprint (SHA1)",
          placeholder: "Fingerprint (SHA1)",
          show: true,
          disabled: true,
          _validate: {},
        },
        {
          type: "file",
          accept: ".pem",
          name: "upload",
          label: "Upload Certificate",
          placeholder: "Upload Certificate",
          _validate: {
            required: true,
            ext: "pem",
          },
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
        label: "Certificate ID",
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
      alias: "",
      data: "",
      serial: "",
      issuerNam: "",
      validNotBefore: "",
      validNotAfter: "",
      subject: "",
      fingerPrint: "",
    });

    const loadingForm = ref(false);
    const loadingTable = ref(false);

    const isPathPartnerList = computed(() => {
      return this.$route.name == "Certificates";
    });

    const getObject = async (index: any) => {
      const newObj = getNewObject();
      const obj = await Utils.Crud.getObject("cert", index, newObj);
      return obj;
    };

    const resetModal = () => {
      infoModal.value.title = "";
      item.value = {
        _id: null,
        alias: "",
        data: "",
        serial: "",
        issuerNam: "",
        validNotBefore: "",
        validNotAfter: "",
        subject: "",
        fingerPrint: "",
      };
      this.$root.$emit("bv::hide::modal", infoModal.value.id);
      loadingForm.value = loadingTable.value = false;
    };

    const existCertificate = async (cert: any) => {
      let exist = false;
      await Utils.Crud.getObjectFilter("partner", cert.key, cert)
        .then(() => {
          exist = true;
        })
        .catch(() => {
          exist = false;
        });
      return exist;
    };

    const deleteObject = async (item: any) => {
      try {
        loadingTable.value = true;
        Swal.fire({
          title: "Are you sure to delete?",
          html: `a cert  ${item.name}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const exist = await existCertificate(item);
            if (!exist) {
              Utils.Crud.deleteObject("cert", item.key)
                .then(() => {
                  Swal.fire("Deleted!", "", "success");
                  getList();
                })
                .catch((e) => {
                  console.log("delete parner", e);
                  Swal.fire("Error!", e, "error");
                });
            } else {
              Swal.fire(
                "Warning!",
                "The certificate is registered with a partner",
                "warning"
              );
            }
          }
          loadingTable.value = false;
        });
      } catch (e) {
        console.log(e);
        Swal.fire("Error!", e, "error");
      }
    };

    const newObject = () => {
      infoModal.value.title = "New certificate";
      item.value = {
        _id: null,
        alias: "",
        data: "",
        serial: "",
        issuerNam: "",
        validNotBefore: "",
        validNotAfter: "",
        subject: "",
        fingerPrint: "",
      };
      schema.value.fields[schema.value.fields.length - 1]._validate = true;
      this.$root.$emit("bv::show::modal", infoModal.value.id);
    };

    const editObject = async (_item: any) => {
      console.log("item_edit", _item);
      infoModal.value.title = "Edit certificate";
      const newObj = getNewObject();
      const result = await getObject(_item.key);
      console.log("resutl al editar", result);
      item.value = Object.assign(item.value, result);
      changedCert();
      schema.value.fields[schema.value.fields.length - 1]._validate = false;
      this.$root.$emit("bv::show::modal", infoModal.value.id);
    };

    const getNewObject = () => {
      loadingTable.value = true;
      const obj: any = { _id: null };
      schema.value.fields.forEach((f) => (obj[f.name] = f.value));
      return obj;
    };

    const getList = async () => {
      items.value = await Utils.Crud.getList("cert").then((results) => {
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
      loadingForm.value = loadingTable.value = true;
      try {
        const _data = {
          _id: null,
          alias: data.alias,
          data: data.data,
        };
        console.log("Saving", data);
        const old_id = data._id;
        if (old_id !== null) {
          await Utils.Crud.deleteObject("cert", old_id).then(
            async () => await Utils.Crud.importCertificate(_data)
          );
        } else {
          await Utils.Crud.importCertificate(_data);
        }
        resetModal();
        await getList();
        loadingForm.value = loadingTable.value = false;
      } catch (e) {
        Swal.fire("Error!", e, "error");
        loadingForm.value = false;
      }
    };

    const fileUpload = ({ file, e }: { file: File; e: Event }) => {
      console.log("item.....", item.value);
      const oFile = file;
      console.log(file);
      const rFilter = /\.(pem)$/i;
      const fileName = oFile.name;
      if (!rFilter.test(fileName)) {
        alert("Error invalid file-type");
        return;
      }
      if (oFile.size == 0) {
        alert("Error unable to read file, empty?");
        return;
      }
      const oReader = new FileReader();
      oReader.onload = function (e) {
        console.log("edit---->", e.target?.result);
        let PEM = e.target?.result as string;
        try {
          PEM = PEM.replace("-----BEGIN CERTIFICATE-----", "").replace(
            "-----END CERTIFICATE-----",
            ""
          );
          PEM = PEM.replace(/[^A-Za-z0-9+/=]+/gm, "");
          item.value.data = PEM;
          changedCert();
          console.log("Read certificate successfully");
        } catch (ex) {
          console.log("Error reading certificate", ex);
          alert("Error reading certificate");
          return;
        }
      };
      oReader.readAsText(oFile);
    };

    const changedCert = () => {
      const cert = new X509();
      console.log("this.item.data", item.value.data);
      let PEM = item.value.data;
      console.log("item.....", item.value);
      if (item.value.data == null) {
        item.value.serial = "";
        item.value.issuerName = "";
        item.value.validNotBefore = null;
        item.value.validNotAfter = null;
        item.value.subject = "";
        item.value.fingerPrint = "";
        return;
      }
      if (PEM.substr(0, 4) !== "----") {
        PEM =
          "-----BEGIN CERTIFICATE-----\n" + PEM + "\n-----END CERTIFICATE-----";
      }

      console.log("PEM changedCert", PEM);
      cert.readCertPEM(PEM);
      item.value.serial = cert.getSerialNumberHex();
      item.value.issuerName = cert.getIssuerString();
      item.value.validNotBefore = zulutodate(cert.getNotBefore());
      item.value.validNotAfter = zulutodate(cert.getNotAfter());
      item.value.subject = cert.getSubjectString();
      item.value.fingerPrint = KJUR.crypto.Util.hashHex(cert.hex, "sha1");
      console.log("item changedCert", item.value);
      console.log("cert changedCert", cert);
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
      loadingForm,
      loadingTable,
      isPathPartnerList,
      getObject,
      resetModal,
      existCertificate,
      deleteObject,
      newObject,
      editObject,
      getNewObject,
      getList,
      saveObject,
      fileUpload,
      changedCert,
    };
  },
});
</script>
<style >
</style>
