import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import EntryFormAndListView from "@/views/EntryFormAndListView.vue"
import SettingsView from "@/views/SettingsView.vue"
import LoginView from "@/views/LoginView.vue"
import MainView from "@/views/MainView.vue"
import { useAuthStore } from "@/stores/useAuthStore"
import SignUpView from "@/views/SignUpView.vue"
import ResetPasswordView from "@/views/ResetPasswordView.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
    meta: { requiresAuth: false },
  },
  {
    path: "/reset_password",
    name: "reset_password",
    component: ResetPasswordView,
    meta: { requiresAuth: false },
  },
  {
    path: "/main",
    component: MainView,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: { name: "entry" },
      },
      {
        path: "/entry",
        name: "entry",
        component: EntryFormAndListView,
      },
      {
        path: "/settings",
        name: "settings",
        component: SettingsView,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
]

const router = createRouter({
  history: createWebHistory("/patme"),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  await authStore.ensureReady()

  const requiresAuth = to.meta.requiresAuth === true || to.meta.requiresAuth === undefined

  if (requiresAuth && !authStore.currentUser) {
    next("/login")
  } else if (!requiresAuth && authStore.currentUser && to.path === "/login") {
    next("/main")
  } else {
    next()
  }
})

export default router
