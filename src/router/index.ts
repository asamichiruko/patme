import { createRouter, createWebHistory } from "vue-router"
import EntryFormAndListView from "@/views/EntryFormAndListView.vue"

const routes = [
  {
    path: "/",
    redirect: "/entry",
  },
  {
    path: "/entry",
    name: "entry",
    component: EntryFormAndListView,
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/SettingsView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/entry",
  },
]

const router = createRouter({
  history: createWebHistory("/patme"),
  routes,
})

export default router
