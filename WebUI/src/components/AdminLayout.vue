<template>
  <div>
    <top-menu
      v-if="$screen.width >= 576"
      :openSidemenu="openSidemenu"
      :closedMenuMovil="closedMenuMovil"
      :showMenu="showMenu"
    />
    <top-menu-phone
      v-if="$screen.width < 576"
      :openSidemenu="openSidemenu"
      :closedMenuMovil="closedMenuMovil"
      :showMenu="showMenu"
    />

    <div class="">
      <shadcn-row no-gutters class="mt-n3">
        <shadcn-col sm="3" md="2" lg="2">
          <side-menu :showMenu="showMenu" />
        </shadcn-col>
        <shadcn-col
          class="border-left"
          :sm="showMenu ? 9 : 12"
          :md="showMenu ? 10 : 12"
          :lg="showMenu ? 10 : 12"
        >
          <shadcn-container fluid class="mt-3">
            <router-view></router-view>
          </shadcn-container>
        </shadcn-col>
      </shadcn-row>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import TopMenu from "./TopMenu";
import TopMenuPhone from "./TopMenuPhone";
import SideMenu from "./SideMenu";

export default defineComponent({
  name: "admin-layout",
  components: {
    TopMenu,
    SideMenu,
    TopMenuPhone,
  },
  setup() {
    const showMenu = ref(true);

    const closedMenuMovil = () => {
      showMenu.value = !showMenu.value;
    };

    const openSidemenu = (e: Event) => {
      e.preventDefault();
      showMenu.value = !showMenu.value;
    };

    return {
      showMenu,
      closedMenuMovil,
      openSidemenu,
    };
  },
});
</script>
<style scoped>
</style>
