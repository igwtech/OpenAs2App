<template>
  <div id="message-detail">
    <shadcn-breadcrumb :items="breadcrumbs"></shadcn-breadcrumb>
    <shadcn-card>
      <shadcn-badge variant="danger">E</shadcn-badge> PAEBSA-A2 -> PAEBSA_OLD
      <span class="text-danger">[process error:unknown-trading-parnetr] </span>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam,</p>
    </shadcn-card>
    <table-custom
      :items="items2"
      :fields="fields"
      :showFilter="false"
      @deleteObject="deleteObject"
      @editObject="editObject"
    ></table-custom>
    <shadcn-card>
      <shadcn-tabs content-class="mt-3">
        <shadcn-tab title="Log" active>
          <small class="text-success">[5/5/22, 3:34:04 AM] [mendAS2-CO3SSQ-1651692834643-0@PAEBSA-AS2_PAEBSA_OLD] Inbound transmission is a AS2 message. It has not been processed because of a trading partner identification problem. </small><br>
          <small class="text-success">[5/5/22, 3:34:04 AM] [mendAS2-CO3SSQ-1651692834643-0@PAEBSA-AS2_PAEBSA_OLD] Generating outbound MDN, setting message id to "mendAS2-1RRNH2W1651692844972-5@PAEBSA_OLD_PAEBSA-AS2". </small><br>
          <small class="text-danger">[5/5/22, 3:34:04 AM] [mendAS2-1RRNH2W-1651692844972-5@PAEBSA_OLD_PAEBSA-AS2] Outbound MDN created for AS2 message "mendAS2-CO3SSQ1651692834643-0@PAEBSA-AS2_PAEBSA_OLD", state set to [processed/error: unknown-trading-partner]. </small><br>
          <small class="text-success">[5/5/22, 3:34:04 AM] [mendAS2-CO3SSQ-1651692834643-0@PAEBSA-AS2_PAEBSA_OLD] Outbound MDN details: Sender AS2 id PAEBSA-AS2 is unknown. </small><br>
          <small class="text-warning">[5/5/22, 3:34:04 AM] [mendAS2-1RRNH2W-1651692844972-5@PAEBSA_OLD_PAEBSA-AS2] Synchronous MDN sent as answer to message mendAS2-CO3SSQ1651692834643-0 @PAEBSA-AS2_PAEBSA_OLD.</small>
        </shadcn-tab>
        <shadcn-tab title="Raw message decrypted">
          <pre>
Content-Type: multipart/report; report-type=disposition-notification; boundary="---=_Part_22_1351266340.1651692844973"
Date: Wed, 4 May 2022 21:34:04 +0200 (CEST)
------=_Part_22_1351266340.1651692844973 
Content-Type: text/plain Content-Transfer-Encoding: 7bit
Sender AS2 id PAEBSA-AS2 is unknown. 
------=_Part_22_1351266340.1651692844973 
Content-Type: message/disposition notification 
Content-Transfer-Encoding: 7bit
Reporting-UA: mendelson AS2 
Original-Recipient: rfc822; PAEBSA_OLD 
Final-Recipient: rfc822; PAEBSA_OLD 
Original-Message-ID: `` endAS2-CO3SSQ-1651692834643-0@PAEBSA-AS2_PAEBSA_OLD 
"
           </pre>
        </shadcn-tab>
        <shadcn-tab title="Message header">
          <small> 
            <pre>
mime-version = 1.0 
date = Wed, 04 May 2022 21:34:04 CEST
server = mendelson AS2 2022 build 542 - www.fol-e-c.com 
content-length = 638 
as2-version = 1.2 
message-id =  mendAS2-1RRNH2W-1651692844972-5@PAEBSA_OLD_PAEBSA-AS2 
connection = close 
as2-to = PAEBSA-AS2
content-type = multipart/report; report-type=disposition-notification; boundary="---=_Part_22_1351266340.1651692844973" 
ediint-features = multiple-attachments, CEM 
as2-from = PAEBSA_OLD

            </pre>
        </small>
        </shadcn-tab>
      </shadcn-tabs>
    </shadcn-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import TableCustom from "./TableCustom.vue";
import Utils from "../utils";
import Swal from "sweetalert2";
import _ from "lodash";

export default defineComponent({
  components: {
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
        text: "Messages",
        to: { name: "Messages" },
        active: false,
      },
      {
        text: "Message Detail",
        to: { name: "MessagesDetail" },
        active: true,
      },
    ]);

    const schema = ref({
      fields: [
        {
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

    const fields = ref([
      {
        key: "key",
        label: "#",
        sortable: true,
        class: "text-center",
      },
      {
        key: "date",
        label: "Date",
        sortable: true,
        class: "text-center",
      },
      {
        key: "security",
        label: "Security",
        sortable: true,
        class: "text-center",
      },
      {
        key: "sender",
        label: "Sender",
        sortable: true,
        class: "text-center",
      },
      {
        key: "server",
        label: "Server",
        sortable: true,
        class: "text-center",
      },
    ]);

    const infoModal = ref({
      id: "info-modal",
      title: "",
    });

    const items = ref<any[]>([]);
    const items2 = ref([
      {
        date: "04/04/2022",
        security: "Unknown/Unknown",
        sender: "192.15.15.1",
        server: "Lorem AS2 2022 BULID 538- www.hola.com",
      },
      {
        date: "04/04/2022",
        security: "Unknown/Unknown",
        sender: "192.15.15.1",
        server: "Lorem AS2 2022 BULID 538- www.hola.com",
      },
      {
        date: "04/04/2022",
        security: "Unknown/Unknown",
        sender: "192.15.15.1",
        server: "Lorem AS2 2022 BULID 538- www.hola.com",
      },
    ]);

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
              detail: { name: "Detail", show: true },
            },
          };
        });
      });
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
    });

    return {
      breadcrumbs,
      schema,
      fields,
      infoModal,
      items,
      items2,
      item,
      isPathMessageList,
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
