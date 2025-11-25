<template>
  <v-row class="mb-4">
    <v-col cols="6">
      <v-text-field
        density="compact"
        variant="outlined"
        placeholder="Search"
        prepend-inner-icon="mdi-magnify"
        hide-details
        v-model="searchQuery"
        @input="handleSearch"
      />
    </v-col>
    <v-col cols="6" class="d-flex justify-end align-center gap-4">
      <v-badge color="error" dot>
        <v-icon size="28" @click="handleNotification">mdi-bell-outline</v-icon>
      </v-badge>
      <v-icon
        size="28"
        @click="toggleTheme"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        {{ isDark ? "mdi-weather-sunny" : "mdi-moon-waning-crescent" }}
      </v-icon>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-avatar
            size="32"
            color="primary"
            v-bind="props"
            style="cursor: pointer"
          >
            <span class="text-white text-caption">CO</span>
          </v-avatar>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title class="text-caption">
              Signed in as: {{ username }}
            </v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="handleLogout" class="text-red">
            <v-list-item-title class="d-flex align-center">
              <v-icon size="18" class="mr-2">mdi-logout</v-icon>
              Logout
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "CoachTopBar",
  emits: ["search", "notification-click", "theme-toggle"],
  inject: ["appTheme"],
  props: {
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchQuery: "",
      username: localStorage.getItem("username") || "User",
    };
  },
  computed: {
    isDark() {
      return this.appTheme ? this.appTheme.isDark() : false;
    },
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.searchQuery);
    },
    handleNotification() {
      this.$emit("notification-click");
    },
    toggleTheme() {
      if (this.appTheme) {
        this.appTheme.toggle();
      } else {
        this.$root.toggleTheme?.();
      }
    },
    handleLogout() {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      localStorage.removeItem("userEmail");

      this.$router.push("/");
      console.log("Umalis na tong user na to ");
    },
  },
};
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}
.v-icon {
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;
}
.v-icon:hover {
  color: #1867c0;
  transform: scale(1.1);
}
</style>
