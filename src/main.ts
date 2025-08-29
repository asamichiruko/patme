import { createApp, watch } from "vue"
import { createPinia } from "pinia"
import router from "./router"
import App from "./App.vue"
import { useAuthStore } from "./stores/useAuthStore"
import { createStorageService } from "./services/createStorageService"
import { useEntryStore } from "./stores/useEntryStore"
import { useTagStore } from "./stores/useTagStore"
import { useCommentStore } from "./stores/useCommentStore"
import { useDataTransferStore } from "./stores/useDataTransferStore"

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const authStore = useAuthStore()
const entryStore = useEntryStore()
const commentStore = useCommentStore()
const tagStore = useTagStore()
const dataTransferStore = useDataTransferStore()

authStore.ensureReady()

watch(
  () => authStore.uid,
  async (uid) => {
    if (uid) {
      const backend = import.meta.env.VITE_STORAGE_BACKEND as "local" | "firestore"

      const storage = createStorageService({ backend, uid })

      entryStore.initialize(storage)
      commentStore.initialize(storage)
      tagStore.initialize(storage)
      dataTransferStore.initialize(storage)

      await Promise.all([entryStore.fetchEntriesWithRelations(), tagStore.fetchTags()])
    } else {
      entryStore.reset()
      commentStore.reset()
      tagStore.reset()
      dataTransferStore.reset()
    }
  },
  { immediate: true },
)

app.use(router)
app.mount("#app")
