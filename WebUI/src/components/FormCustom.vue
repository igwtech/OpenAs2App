<template>
  <b-form @submit.stop.prevent="submitForm">
    <template v-for="(field, index) in schema.fields">
      <template v-if="field.type === 'select'">
        <b-form-group
          v-if="field.show!=undefined?field.show:true"
          :key="index"
          :id="`type-${field.name}`"
          :label="field.label"
          :label-for="field.name"
        >
          <!-- :value-field="field.value ? field.value : 'hh'" -->
          <b-form-select
            :disabled="field.disabled?field.disabled:false"
            :id="field.name"
            :name="field.name"
            v-model="model[field.name]"
            :type="field.type"
            :placeholder="field.placeholder"
            v-validate="field._validate"
            :state="validateState(field.name)"
            :data-vv-as="field.label"
            :options="field.list"
            :aria-describedby="`${field.name}-feedback`"
          ></b-form-select>
          <b-form-invalid-feedback :id="`${field.name}-feedback`">{{
            veeErrors.first(field.name)
          }}</b-form-invalid-feedback>
        </b-form-group>
      </template>
      <template v-else-if="field.type === 'textarea'">
        <b-form-group
          v-if="field.show!=undefined?field.show:true"
          :key="index"
          :id="`type-${field.name}`"
          :label="field.label"
          :label-for="field.name"
        >
          <!-- :value-field="field.value ? field.value : 'hh'" -->
          <b-form-textarea
            :disabled="field.disabled?field.disabled:false"
            :id="field.name"
            :name="field.name"
            v-model="model[field.name]"
            :placeholder="field.placeholder"
            v-validate="field._validate"
            :state="validateState(field.name)"
            :data-vv-as="field.label"
            :options="field.list"
            :aria-describedby="`${field.name}-feedback`"
            rows="5"
            max-rows="6"
          ></b-form-textarea>
          <b-form-invalid-feedback :id="`${field.name}-feedback`">{{
            veeErrors.first(field.name)
          }}</b-form-invalid-feedback>
        </b-form-group>
      </template>
      <template v-else-if="field.type === 'datepicker'">
        <b-form-group
          v-if="field.show!=undefined?field.show:true"
          :key="index"
          :id="`type-${field.name}`"
          :label="field.label"
          :label-for="field.name"
        >
          <b-form-datepicker
            :disabled="field.disabled?field.disabled:false"
            :id="field.name"
            :name="field.name"
            v-model="model[field.name]"
            :placeholder="field.placeholder"
            v-validate="field._validate"
            :state="validateState(field.name)"
            :data-vv-as="field.label"
            :options="field.list"
            :aria-describedby="`${field.name}-feedback`"
          ></b-form-datepicker>
          <b-form-invalid-feedback :id="`${field.name}-feedback`">{{
            veeErrors.first(field.name)
          }}</b-form-invalid-feedback>
        </b-form-group>
      </template>
      <template v-else-if="field.type === 'file'">
        <b-form-group
          v-if="field.show!=undefined?field.show:true"
          :key="index"
          :id="`type-${field.name}`"
          :label="field.label"
          :label-for="field.name"
        >
          <b-form-file
            :accept="field.accept?field.accept:'*'"
            :disabled="field.disabled?field.disabled:false"
            :id="field.name"
            :name="field.name"
            v-model="model[field.name]"
            :placeholder="field.placeholder"
            v-validate="field._validate"
            :state="validateState(field.name)"
            :data-vv-as="field.label"
            :options="field.list"
            :aria-describedby="`${field.name}-feedback`"
            @change="fileUpload"
          ></b-form-file>
          <b-form-invalid-feedback :id="`${field.name}-feedback`">{{
            veeErrors.first(field.name)
          }}</b-form-invalid-feedback>
        </b-form-group>
      </template>
      <template v-else-if="field.type === 'checkbox'">
        <b-form-group
          v-if="field.show!=undefined?field.show:true"
          :key="index"
          :id="`type-${field.name}`"
          :label-for="field.name"
        >
          <!-- :label="field.label" -->
          <b-form-checkbox
            :disabled="field.disabled?field.disabled:false"
            :id="field.name"
            v-model="model[field.name]"
            :name="field.name"
            :type="field.type"
            :placeholder="field.placeholder"
            v-validate="field._validate"
            :state="validateState(field.name)"
            :data-vv-as="field.label"
            :aria-describedby="`${field.name}-feedback`"
            >{{ field.label }}</b-form-checkbox
          >
          <b-form-invalid-feedback :id="`${field.name}-feedback`">{{
            veeErrors.first(field.name)
          }}</b-form-invalid-feedback>
        </b-form-group>
      </template>
      <template v-else>
        <b-form-group
          v-if="field.show!=undefined?field.show:true"
          :key="index"
          :id="`type-${field.name}`"
          :label="field.label"
          :label-for="field.name"
        >
          <b-form-input
            :disabled="field.disabled?field.disabled:false"
            :id="field.name"
            v-model="model[field.name]"
            :name="field.name"
            :type="field.type"
            :placeholder="field.placeholder"
            v-validate="field._validate"
            :state="validateState(field.name)"
            :data-vv-as="field.label"
            :aria-describedby="`${field.name}-feedback`"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${field.name}-feedback`">{{
            veeErrors.first(field.name)
          }}</b-form-invalid-feedback>
        </b-form-group>
      </template>
    </template>
    <b-row>
      <!-- <b-col col > -->
      <b-button-group>
        <b-button :disabled="loading" type="submit" variant="success" size="sm">Save</b-button>
        <b-button :disabled="loading" @click="cancelForm" size="sm">Cancel</b-button>
      </b-button-group>
      <!-- </b-col> -->
    </b-row>
  </b-form>
</template>
<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';

export default defineComponent({
  props: {
    schema: {
      type: Object as PropType<{ fields: any[] }>,
      required: true,
    },
    model: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const data = ref({ ...props.model });

    const validateState = (ref: string) => {
      if (
        (props as any).veeFields[ref] &&
        ((props as any).veeFields[ref].dirty || (props as any).veeFields[ref].validated)
      ) {
        return !(props as any).veeErrors.has(ref);
      }
      return null;
    };

    const submitForm = (e: Event) => {
      e.preventDefault();
      (props as any).$validator.validateAll().then((result: boolean) => {
        if (!result) {
          return;
        }
        emit("commit", data.value);
      });
    };

    const cancelForm = (e: Event) => {
      emit("revert", data.value._id);
    };

    const fileUpload = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const oFile = target.files ? target.files[0] : null;
      if (oFile && oFile.size > 0) {
        emit("fileUpload", { file: oFile, e });
      }
    };

    return {
      data,
      validateState,
      submitForm,
      cancelForm,
      fileUpload,
    };
  },
});
</script>
