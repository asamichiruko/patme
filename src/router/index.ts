import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import EntryFormAndListView from "@/views/EntryFormAndListView.vue"
import SettingsView from "@/views/SettingsView.vue"
import LoginView from "@/views/LoginView.vue"
import { auth } from "@/firebase"
import MainView from "@/views/MainView.vue"
import { onAuthStateChanged } from "firebase/auth"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
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

let authReady: Promise<void> | null = null
const ensureAuthReady = () => {
  if (!authReady) {
    authReady = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, () => {
        unsubscribe()
        resolve()
      })
    })
  }
  return authReady
}

router.beforeEach(async (to, from, next) => {
  await ensureAuthReady()

  const user = auth.currentUser
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !user) {
    next("/login")
  } else if (to.path === "/login" && user && !user.isAnonymous) {
    next("/main")
  } else {
    next()
  }
})

export default router
