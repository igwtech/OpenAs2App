<template>
  <b-list-group v-if="showMenu" flush>
      <b-list-group-item  :key="route.path" v-for="route in routes"
          :to="route.path"
          :active="actualRoute == route.name"
        >
        <b-icon :icon="getIcons(route.name)" ></b-icon>
       {{ route.name }}
        </b-list-group-item
      >
    </b-list-group>
  <!-- <nav
    class="d-none bg-light sidebar"
    :class="showMenu ? 'd-md-block d-sm-block ' : ''"
  >
  <div class="sidebar-sticky"> 
    <ul class="nav nav-pills nav-justified navbar-nav">
      <li class="nav-item" :key="route.path" v-for="route in routes">
        <router-link
          class="nav-link"
          :class="{ active: actualRoute == route.name }"
          :to="route.path"
        >
          {{ route.name }}
        </router-link>
      </li>
    </ul>
    </div>
  </nav> -->
</template>
<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import router from "../routes";

export default defineComponent({
  name: "side-menu",
  props: {
    showMenu: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const routes = ref(
      router.options.routes.filter((e) =>
        e.meta != null ? e.meta.sidemenu : false
      )
    );

    const actualRoute = computed(() => {
      return router.currentRoute.value.name;
    });

    const getIcons = (routeName: string) => {
      let icon = "house";
      switch (routeName) {
        case "Dashboard":
          icon = "graph-up";
          break;
        case "Partners":
          icon = "person";
          break;
        case "Connections":
          icon = "people";
          break;
        case "Certificates":
          icon = "file-earmark-richtext";
          break;
        case "Messages":
          icon = "chat-right-dots";
          break;
        default:
          icon = "house";
          break;
      }
      return icon;
    };

    return {
      routes,
      actualRoute,
      getIcons,
    };
  },
});
</script>
<style>
/*
 * Sidebar
 */

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100; /* Behind the navbar */
  padding: 48px 0 0; /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
  text-align: left;
}

.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px);
  padding-top: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

@supports ((position: -webkit-sticky) or (position: sticky)) {
  .sidebar-sticky {
    position: -webkit-sticky;
    position: sticky;
  }
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
  text-align: left;
  padding-left: 3em;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #999;
}

.sidebar .nav-link.active {
  color: #007bff;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: 0.75rem;
  text-transform: uppercase;
}

@media (max-width: 575px) {
  .display-menu {
    display: block !important;
  }
  .d-none {
  }
}
</style>
