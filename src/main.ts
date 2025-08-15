import { createApp } from "vue"
import { createPinia } from "pinia"
import { createStorageService } from "./services/createStorageService"
import { initializeEntryService } from "./stores/useEntryStore"
import { initializeCommentService } from "./stores/useCommentStore"
import { initializeTagService } from "./stores/useTagStore"
import router from "./router"
import App from "./App.vue"
import { initializeDataTransferService } from "./stores/useDataTransferStore"
import { auth } from "./firebase"
import { signInAnonymously, onAuthStateChanged } from "firebase/auth"

const app = createApp(App)

// 起動時に匿名サインイン
signInAnonymously(auth)
  .then(() => {
    console.log("匿名サインイン成功")
  })
  .catch((error) => {
    console.error("匿名サインイン失敗", error)
  })

// 認証状態の監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("ログイン中 UID:", user.uid)
  } else {
    console.log("ログアウト状態")
  }
})

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
