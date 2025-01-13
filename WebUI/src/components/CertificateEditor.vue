<template>
     <div id="editor">
        <form @submit.prevent="submitForm">
            <h1 v-html="title"></h1>
                <input type="hidden" v-model="data.data" name="data"  >
                <div class="form-group" >
                        <label for="alias">Certificate Alias Name</label>
                        <input type="text" v-model="data.alias" name="alias"  class="form-control" >
                </div>
                <div class="form-group " >
                    <label for="serial" >Serial Number (HEX)</label>
                    <div class="form-control" name="serial" v-html="serial"></div>
                </div>
                <div class="form-group " >
                    <label for="validNotBefore" >Valid Not Before</label>
                    <div class="form-control" name="validNotBefore" v-html="validNotBefore"></div>
                </div>
                <div class="form-group " >
                    <label for="validNotAfter" >Expiration Date</label>
                    <div class="form-control" name="validNotAfter" v-html="validNotAfter"></div>
                </div>
                <div class="form-group " >
                    <label for="subject" >Subject</label>
                    <div class="form-control" name="subject" v-html="subject"></div>
                </div>
                <div class="form-group " >
                    <label for="fingerPrint" >Fingerprint (SHA1)</label>
                    <div class="form-control" name="fingerPrint" v-html="fingerPrint"></div>
                </div>
                <div class="form-group">
                    <label for="upload">Upload Certificate</label>
                    <input type="file" id="upload" name="upload" @change="fileUpload">
                </div>
                <div class="btn-group" role="group" aria-label="Actions">
                    <button type="submit" class="btn btn-primary">Ok</button>
                    <a type="button" @click="cancelForm" class="btn btn-outline-secondary">Cancel</a>
                    <a type="button" v-if="data._id !== 'new'" @click="deleteForm" class="btn btn-danger">Delete</a>
                </div>
        </form>
     </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';

export default defineComponent({
  props: {
    model: {
      type: Object as PropType<Promise<Record<string, any>>>,
      required: true,
    },
    schema: {
      type: Object as PropType<{ fields: any[] }>,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
  },
  setup(props, { emit }) {
    const serial = ref<string | number>(0);
    const validNotBefore = ref<string | null>(null);
    const validNotAfter = ref<string | null>(null);
    const fingerPrint = ref<string>('');
    const subject = ref<string>('');
    const issuerName = ref<string>('');
    const data = ref<{ alias: string | null; data: string | null }>({ alias: null, data: null });

    props.model.then((e) => (data.value = e));

    watch(data, (e) => {
      console.log('DATA CHANGED!', e);
      changedCert();
    });

    const submitForm = (e: Event) => {
      console.log('submitForm', e);
      e.preventDefault();
      emit('commit', data.value);
    };

    const deleteForm = (e: Event) => {
      console.log('submitForm', e);
      e.preventDefault();
      emit('delete', data.value?._id);
    };

    const cancelForm = (e: Event) => {
      emit('revert', data.value?._id);
    };

    const fileUpload = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const oFile = target.files ? target.files[0] : null;
      console.log(oFile, e);
      const rFilter = /^(application\/x-x509-ca-cert|application\/x-pkcs12)$/i;
      if (!oFile || !rFilter.test(oFile.type)) {
        alert('Error invalid file-type');
        return;
      }
      if (oFile.size == 0) {
        alert('Error unable to read file, empty?');
        return;
      }
      const oReader = new FileReader();
      oReader.onload = function (e) {
        console.log(e.target?.result);
        let PEM = e.target?.result as string;
        PEM = PEM.replace('-----BEGIN CERTIFICATE-----', '').replace('-----END CERTIFICATE-----', '');
        PEM = PEM.replace(/[^A-Za-z0-9+/=]+/gm, '');
        data.value.data = PEM;
        changedCert();
      };
      oReader.readAsText(oFile);
    };

    const changedCert = () => {
      const cert = new X509();
      let PEM = data.value.data;
      if (data.value.data == null) {
        serial.value = '';
        issuerName.value = '';
        validNotBefore.value = null;
        validNotAfter.value = null;
        subject.value = '';
        fingerPrint.value = '';
        return;
      }
      if (PEM.substr(0, 4) !== '----') {
        PEM = '-----BEGIN CERTIFICATE-----\n' + PEM + '\n-----END CERTIFICATE-----';
      }
      cert.readCertPEM(PEM);
      serial.value = cert.getSerialNumberHex();
      issuerName.value = cert.getIssuerString();
      validNotBefore.value = zulutodate(cert.getNotBefore());
      validNotAfter.value = zulutodate(cert.getNotAfter());
      subject.value = cert.getSubjectString();
      fingerPrint.value = KJUR.crypto.Util.hashHex(cert.hex, 'sha1');
      console.log(cert);
    };

    return {
      serial,
      validNotBefore,
      validNotAfter,
      fingerPrint,
      subject,
      issuerName,
      data,
      submitForm,
      deleteForm,
      cancelForm,
      fileUpload,
      changedCert,
    };
  },
});
</script>
<style scoped>

</style>
