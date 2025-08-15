import { createApp } from "vue"
import { createPinia } from "pinia"
import { createStorageService } from "./services/createStorageService"
import { initializeEntryService } from "./stores/useEntryStore"
import { initializeCommentService } from "./stores/useCommentStore"
import { initializeTagService } from "./stores/useTagStore"
import router from "./router"
import App from "./App.vue"
import { initializeDataTransferService } from "./stores/useDataTransferStore"

const app = createApp(App)
const pinia = createPinia()

const storageService = createStorageService({
  backend: import.meta.env.VITE_STORAGE_BACKEND as "local" | "firestore",
})
initializeEntryService(storageService)
initializeCommentService(storageService)
initializeTagService(storageService)
initializeDataTransferService(storageService)

app.use(pinia)
app.use(router)
app.mount("#app")
