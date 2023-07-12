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
      <b-row no-gutters>
        <b-col sm="3" md="2" lg="2" >
          <side-menu :showMenu="showMenu" />
        </b-col>
        <!-- <div class="w-100"></div> -->
        <b-col
        class="border-left"
          :sm="showMenu ? 9 : 12"
          :md="showMenu ? 10 : 12"
          :lg="showMenu ? 10 : 12"
        >
          <b-container fluid class="mt-3">
            <router-view></router-view>
          </b-container>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import TopMenu from "./TopMenu";
import TopMenuPhone from "./TopMenuPhone";

import SideMenu from "./SideMenu";
export default {
  name: "admin-layout",
  data() {
    return {
      showMenu: true,
    };
  },
  components: {
    TopMenu,
    SideMenu,
    TopMenuPhone,
  },
  methods: {
    closedMenuMovil() {
      this.showMenu = !this.showMenu;
    },
    openSidemenu(e) {
      e.preventDefault();
      this.showMenu = !this.showMenu;
    },
  },
};
</script>
<style scoped>
</style>