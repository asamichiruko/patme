import { createApp } from "vue"
import { createPinia } from "pinia"
import { storagePlugin } from "./plugins/storagePlugin"
import { createStorageService } from "./services/createStorageService"
import router from "./router"
import App from "./App.vue"

const app = createApp(App)
const pinia = createPinia()

const storageService = createStorageService({
  backend: import.meta.env.VITE_STORAGE_BACKEND as "local" | "firestore",
})

pinia.use(storagePlugin(storageService))

app.use(pinia)
app.use(router)
app.mount("#app")
