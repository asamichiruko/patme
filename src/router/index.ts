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
    meta: { allowUnauthed: true, allowUnverified: true },
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
    meta: { allowUnauthed: true, allowUnverified: true },
  },
  {
    path: "/reset_password",
    name: "reset_password",
    component: ResetPasswordView,
    meta: { allowUnauthed: true },
  },
  {
    path: "/verify_email",
    name: "verify_email",
    component: ResetPasswordView,
    meta: { allowUnauthed: false, allowUnverified: true },
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

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.ensureReady()

  const user = authStore.currentUser

  if (to.name === "reset_password") {
    if (!user) return true
    return { name: "main" }
  }

  // 未ログインユーザ
  if (!user) {
    if (to.meta.allowUnauthed) {
      return true
    }
    return { name: "login" }
  }

  // password ログインで未認証の場合
  const isPasswordProvider = user.providerData.some((p) => p.providerId === "password")
  if (isPasswordProvider && !user.emailVerified) {
    if (to.meta.allowUnverified) {
      return true
    }
    return { name: "verify_email" }
  }

  // ゲスト, プロバイダ, 認証済み email の場合
  if (to.name === "verify_email") {
    return { name: "main" }
  }
  return true
})

export default router
