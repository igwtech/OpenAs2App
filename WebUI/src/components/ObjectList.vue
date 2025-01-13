<template>
<div id="object-list">
    <section v-if="errored">
        <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
     </section>
     <section v-else>
        <div v-if="loading">Loading...</div>
        <div v-else class="table-responsive">
            <table class="table table-striped table-sm">
            <thead>
                <tr v-if="info[0]">
                <th  v-for="(data,key) in info[0].data" v-html="key"></th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody v-if="info.length">
                <tr v-for="item in info">
                <td  v-for="(data,key) in item.data" v-html="data" ></td>
                <td> 
                    <span v-for="(action,name) in item.actions" ><router-link :to="action" v-html="name" ></router-link></span>
                </td>
                </tr>
            </tbody>
            <p v-else > No partners found</p> 
            </table>
        </div>
     </section>
</div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue';

export default defineComponent({
  name: 'object-list',
  props: {
    src: {
      type: Function as PropType<() => Promise<any[]>>,
      required: true,
    },
  },
  setup(props) {
    const loading = ref(false);
    const info = ref<any[]>([]);
    const errored = ref(false);

    onMounted(async () => {
      console.log('Mounting');
      loading.value = true;
      try {
        const result = await props.src();
        console.log('SRC:', result);
        if (result != null) info.value = result;
      } catch (e) {
        console.log(e);
        errored.value = true;
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      info,
      errored,
    };
  },
});
</script>
