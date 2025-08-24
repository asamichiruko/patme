import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import EntryFormAndListView from "@/views/EntryFormAndListView.vue"
import SettingsView from "@/views/SettingsView.vue"
import LoginView from "@/views/LoginView.vue"
import MainView from "@/views/MainView.vue"
import { useAuthStore } from "@/stores/useAuthStore"
import SignUpView from "@/views/SignUpView.vue"
import ResetPasswordView from "@/views/ResetPasswordView.vue"
import VerifyEmailView from "@/views/VerifyEmailView.vue"
import AccountSettingsView from "@/views/AccountSettingsView.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { guestOnly: true },
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
    meta: { guestOnly: true },
  },
  {
    path: "/reset_password",
    name: "reset_password",
    component: ResetPasswordView,
    meta: { guestOnly: true },
  },
  {
    path: "/verify_email",
    name: "verify_email",
    component: VerifyEmailView,
    meta: { requiresAuth: true },
  },
  {
    path: "/account_settings",
    name: "account_settings",
    component: AccountSettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/main",
    component: MainView,
    meta: { requiresAuth: true, requiresEmailVerified: true },
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

  const user = authStore.currentUser
  const isLoggedIn = user !== null
  const isEmailProvider = user?.providerData.some((p) => p.providerId === "password") ?? false
  const isVerified = !isEmailProvider || user?.emailVerified === true

  // 1. 未ログインなのに requiresAuth
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: "login" })
  }

  // 2. ログイン済みなのに guestOnly ページへアクセス
  if (to.meta.guestOnly && isLoggedIn) {
    return next({ path: "/main" })
  }

  // 3. メール認証が必須だが未認証
  if (to.meta.requiresEmailVerified && isLoggedIn && !isVerified) {
    return next({ name: "verify_email" })
  }

  // デフォルトは許可
  return next()
})

export default router
