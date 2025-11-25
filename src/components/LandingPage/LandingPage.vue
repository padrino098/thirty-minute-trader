<template>
  <v-app>
    <v-main class="login-background">
      <v-container fluid class="fill-height d-flex align-center justify-center">
        <v-card elevation="10" class="pa-8 rounded-xl login-card">
          <!-- Logo -->
          <div class="text-center mb-6">
            <div class="d-flex flex-column align-center justify-center mb-2">
              <div class="d-flex align-center justify-center mb-2">
                <v-icon size="52" color="primary">mdi-chart-line</v-icon>
              </div>
              <span class="text-h4 font-weight-bold primary--text text-center">
                THIRTY MINUTE<br />TRADER
              </span>
            </div>
            <p class="text-caption text-medium-emphasis mt-2">
              TRADING PLATFORM
            </p>
          </div>

          <v-form @submit.prevent="handleLogin" class="mt-4">
            <v-text-field
              v-model="username"
              label="Username"
              variant="outlined"
              density="comfortable"
              required
              prepend-inner-icon="mdi-account"
              class="mb-4"
            />

            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              variant="outlined"
              density="comfortable"
              required
              prepend-inner-icon="mdi-lock"
              class="mb-6"
            />

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="loading"
              class="mb-4 rounded-lg"
            >
              <v-icon left>mdi-login</v-icon>
              LOGIN
            </v-btn>
          </v-form>

          <v-divider class="my-4"></v-divider>

          <div class="text-center">
            <p class="text-caption text-medium-emphasis mb-3">Quick Access</p>
            <div class="d-flex justify-center" style="gap: 10px">
              <v-btn
                color="secondary"
                variant="outlined"
                size="small"
                class="rounded-lg"
                @click="demoLogin('coach')"
              >
                <v-icon left size="16">mdi-chart-line</v-icon>
                Trader
              </v-btn>
              <v-btn
                color="secondary"
                variant="outlined"
                size="small"
                class="rounded-lg"
                @click="demoLogin('student')"
              >
                <v-icon left size="16">mdi-school</v-icon>
                Student
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "LandingPage",
  data() {
    return {
      userType: "coach",
      username: "",
      password: "",
      loading: false,
      userTypes: [
        { title: "Professional Trader", value: "coach" },
        { title: "Trading Student", value: "student" },
      ],
    };
  },
  methods: {
    async handleLogin() {
      if (!this.username || !this.password) {
        alert("Please enter both username and password");
        return;
      }

      this.loading = true;

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", this.userType);
        localStorage.setItem("username", this.username);

        this.$router.push(this.userType === "coach" ? "/coach" : "/student");
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please try again.");
      } finally {
        this.loading = false;
      }
    },

    demoLogin(role) {
      this.userType = role;
      this.username = role === "coach" ? "trader_pro" : "student_learner";
      this.password = role === "coach" ? "trade123" : "learn123";
      this.handleLogin();
    },
  },
  mounted() {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
  },
};
</script>

<style scoped>
.login-background {
  background: linear-gradient(
      135deg,
      rgba(13, 17, 23, 0.95) 0%,
      rgba(22, 27, 34, 0.92) 100%
    ),
    url("https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")
      center/cover no-repeat;
  position: relative;
  overflow: hidden;
}

.fill-height {
  height: 100vh;
}

.login-card {
  width: 400px;
  max-width: 90%;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.95) !important;
  position: relative;
  z-index: 2;
}
.fill-height {
  height: 100vh;
}

.login-card {
  width: 400px;
  max-width: 90%;
  backdrop-filter: blur(6px);
  background-color: rgba(14, 15, 14, 0.95) !important;
}
</style>
