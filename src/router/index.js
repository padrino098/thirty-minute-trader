import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Login",
    component: () =>
      import(
        /* webpackChunkName: "login" */ "../components/LandingPage/LandingPage.vue"
      ),
    meta: { requiresAuth: false },
  },
  {
    path: "/coach",
    name: "CoachDashboard",
    component: () =>
      import(
        /* webpackChunkName: "coach" */ "../views/CoachDb/CoachDashboard.vue"
      ),
    meta: { requiresAuth: true, role: "coach" },
  },
  {
    path: "/student",
    name: "StudentDashboard",
    component: () =>
      import(
        /* webpackChunkName: "student" */ "../views/StudentDb/StudentDashboard.vue"
      ),
    meta: { requiresAuth: true, role: "student" },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Authentication guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userRole = localStorage.getItem("userRole");

  // If route requires auth and user is not authenticated, redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/");
  }
  // If user is authenticated but trying to access wrong role dashboard
  else if (to.meta.requiresAuth && to.meta.role && to.meta.role !== userRole) {
    // Redirect to their appropriate dashboard
    if (userRole === "coach") {
      next("/coach");
    } else if (userRole === "student") {
      next("/student");
    } else {
      next("/");
    }
  }
  // If user is authenticated and trying to access login page, redirect to their dashboard
  else if (to.name === "Login" && isAuthenticated) {
    if (userRole === "coach") {
      next("/coach");
    } else if (userRole === "student") {
      next("/student");
    } else {
      next("/");
    }
  }
  // Otherwise, proceed normally
  else {
    next();
  }
});

export default router;
