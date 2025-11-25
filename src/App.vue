<template>
  <v-app :theme="theme">
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      theme: "light",
    };
  },
  methods: {
    initializeTheme() {
      // Check for saved theme preference or use system preference
      const savedTheme = localStorage.getItem("darkMode");

      if (savedTheme !== null) {
        this.theme = savedTheme === "true" ? "dark" : "light";
      } else {
        // Use system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        this.theme = prefersDark ? "dark" : "light";
      }

      // Set the theme globally
      this.setGlobalTheme(this.theme);
    },

    setGlobalTheme(theme) {
      this.theme = theme;
      // You can also emit a global event for other components to listen to
      this.$bus?.emit("theme-changed", theme === "dark");
    },

    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
      localStorage.setItem("darkMode", (this.theme === "dark").toString());
      this.setGlobalTheme(this.theme);
      console.log(`Theme switched to ${this.theme} mode`);
    },
  },
  mounted() {
    this.initializeTheme();

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("darkMode")) {
          this.theme = e.matches ? "dark" : "light";
          this.setGlobalTheme(this.theme);
        }
      });

    // Global method for child components to toggle theme
    this.$root.toggleTheme = this.toggleTheme.bind(this);
  },
  provide() {
    return {
      appTheme: {
        current: this.theme,
        toggle: this.toggleTheme.bind(this),
        isDark: () => this.theme === "dark",
      },
    };
  },
};
</script>

<style>
/* Smooth transitions for theme switching */
.v-application {
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
