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

let isAuthInitialized = false

router.beforeEach((to, from, next) => {
  if (!isAuthInitialized) {
    onAuthStateChanged(auth, () => {
      isAuthInitialized = true
      next({ ...to, replace: true })
    })
  } else {
    const user = auth.currentUser
    const requiresAuth = to.path !== "/login"

    if (requiresAuth && !user) {
      next("/login")
    } else if (to.path === "/login" && user) {
      next("/main")
    } else {
      next()
    }
  }
})

export default router
