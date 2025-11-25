<template>
  <div>
    <!-- App Bar with Hamburger Menu -->
    <v-app-bar color="#388E3C" density="compact" v-if="isMobile">
      <v-app-bar-nav-icon @click="drawer = !drawer" variant="text">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>
      <v-app-bar-title>Coach Dashboard</v-app-bar-title>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :temporary="isMobile"
      :permanent="!isMobile"
      :expand-on-hover="!isMobile && !drawerExpanded"
      app
      width="230"
    >
      <!-- Desktop Header (only show when not collapsed) -->
      <template v-slot:prepend v-if="!isMobile">
        <v-list-item
          title="Coach Dashboard"
          prepend-icon="mdi-account-tie"
          @click="toggleDrawerExpanded"
        >
          <template v-slot:append>
            <v-icon v-if="!drawerExpanded">mdi-chevron-right</v-icon>
            <v-icon v-else>mdi-chevron-left</v-icon>
          </template>
        </v-list-item>
      </template>

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="drawerExpanded || isMobile ? item.title : ''"
          :value="item.title"
          @click="handleMenuClick(item)"
          :class="{ 'active-menu': activeMenu === item.title }"
        >
          <template v-slot:append v-if="!drawerExpanded && !isMobile">
            <v-tooltip location="right" :disabled="drawerExpanded || isMobile">
              <template v-slot:activator="{ props }">
                <span v-bind="props">{{ item.title }}</span>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>
      </v-list>

      <!-- Expand/Collapse Button for Desktop -->
      <template v-slot:append v-if="!isMobile">
        <v-list-item
          :prepend-icon="
            drawerExpanded
              ? 'mdi-chevron-double-left'
              : 'mdi-chevron-double-right'
          "
          :title="drawerExpanded ? 'Collapse' : 'Expand'"
          @click="toggleDrawerExpanded"
          class="expand-toggle"
        />
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "CoachNavbar",
  emits: ["menu-click"],
  data() {
    return {
      drawer: true,
      drawerExpanded: true,
      activeMenu: "Dashboard",
      menuItems: [
        { icon: "mdi-view-dashboard", title: "Dashboard" },
        { icon: "mdi-account-group", title: "Students" },
        { icon: "mdi-file-document", title: "History" },
        { icon: "mdi-message", title: "Messages" },
      ],
    };
  },
  computed: {
    isMobile() {
      // You can use VueUse or your own breakpoint logic
      return this.$vuetify.display.mobile || window.innerWidth < 768;
    },
  },
  methods: {
    handleMenuClick(item) {
      this.activeMenu = item.title;
      this.$emit("menu-click", item);

      // Auto-close drawer on mobile after selection
      if (this.isMobile) {
        this.drawer = false;
      }
    },
    toggleDrawerExpanded() {
      this.drawerExpanded = !this.drawerExpanded;
    },
  },
  mounted() {
    // Initialize drawer state based on screen size
    if (this.isMobile) {
      this.drawer = false;
      this.drawerExpanded = true;
    }
  },
};
</script>

<style scoped>
.active-menu {
  background-color: rgba(0, 0, 0, 0.08);
  border-right: 3px solid #4ac858;
}

.v-list-item {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.expand-toggle {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.v-navigation-drawer {
  transition: all 0.3s ease;
}
</style>
