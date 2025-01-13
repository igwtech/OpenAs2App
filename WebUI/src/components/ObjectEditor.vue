<template>
    <div id="editor">
        <form @submit.prevent="submitForm">
            <h1 v-html="title"></h1>
            <div v-for="field in schema.fields" >
                <template  v-if="field.type=='display'">
                    <div class="form-group form-check checkbox" >
                        <label :for="field.name" v-html="field.label"></label>
                        <pre v-model="data[field.name]" :name="field.name"  class="form-control" v-html="data[field.name]" >
                            
                        </pre>
                    </div>
                </template>
                <template  v-else-if="field.type=='textarea'">
                    <div class="form-group form-check checkbox" >
                        <label :for="field.name" v-html="field.label"></label>
                        <textarea v-model="data[field.name]" :name="field.name"  class="form-control" >
                            
                        </textarea>
                    </div>
                </template>
                <template  v-else-if="field.type=='checkbox'">
                    <div class="form-group form-check checkbox" >
                        <label :for="field.name">
                            <input type="checkbox" v-model="data[field.name]" :name="field.name" data-toggle="toggle" class="form-control" >
                            {{field.label}}
                        </label>
                    </div>
                </template>
                <template v-else-if="field.type=='radio'">
                    <div class="form-group form-radio" >
                        <label :for="field.name" v-html="field.label"></label>
                        <span v-for="item in field.list">
                            <input type="radio" v-model="data[field.name]" :name="field.name" class="form-control" :value="item">
                            {{item}}
                        </span>
                    </div>
                </template>
                <template v-else-if="field.type=='select'">
                    <div class="form-group " >
                        <label :for="field.name" v-html="field.label"></label>
                        <select  v-model="data[field.name]" :name="field.name" class="form-control" >
                            <option v-bind:key="item" v-for="item in field.list" v-html="item" ></option>
                        </select>
                    </div>
                </template>
                <template  v-else>
                    <div class="form-group" >
                        <label :for="field.name" v-html="field.label"></label>
                        <input :type="field.type" v-model="data[field.name]" :name="field.name" class="form-control" :placeholder="field.placeholder">
                    </div>
                </template>
            </div>
            <slot></slot>
            <div class="btn-group" role="group" aria-label="Actions">
                <button type="submit" class="btn btn-primary">Ok</button>
                <a type="button" @click="cancelForm" class="btn btn-outline-secondary">Cancel</a>
                <a type="button" v-if="data._id !== 'new'" @click="deleteForm" class="btn btn-danger">Delete</a>
            </div>
        </form>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';

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
    const data = ref<Record<string, any> | null>(null);

    props.model.then((e) => (data.value = e));

    const submitForm = (e: Event) => {
      e.preventDefault();
      emit('commit', data.value);
    };

    const deleteForm = (e: Event) => {
      e.preventDefault();
      emit('delete', data.value?._id);
    };

    const cancelForm = (e: Event) => {
      emit('revert', data.value?._id);
    };

    return {
      data,
      submitForm,
      deleteForm,
      cancelForm,
    };
  },
});

</script>
