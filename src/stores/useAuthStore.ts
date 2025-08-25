import { auth } from "@/firebase"
import { FirebaseError } from "firebase/app"
import {
  getRedirectResult,
  signInAnonymously,
  signOut,
  GoogleAuthProvider,
  linkWithRedirect,
  type User,
  type Unsubscribe,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  sendEmailVerification,
  validatePassword,
  unlink,
  signInWithRedirect,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useEntryStore } from "./useEntryStore"
import { useCommentStore } from "./useCommentStore"
import { useTagStore } from "./useTagStore"
import { useDataTransferStore } from "./useDataTransferStore"
import { createStorageService } from "@/services/createStorageService"
import type { StorageService } from "@/services/StorageService"

let authReadyResolve: () => void
const authReadyPromise = new Promise<void>((resolve) => {
  authReadyResolve = resolve
})

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref<User | null>(null)
  const loading = ref(true)
  const storageService = ref<StorageService | null>(null)

  const isLoggedIn = computed(() => !!currentUser.value)
  const isAnonymous = computed(() => currentUser.value?.isAnonymous ?? false)
  const email = computed(() => currentUser.value?.email ?? null)
  const emailVerified = computed(() => currentUser.value?.emailVerified ?? false)
  const providers = computed(() => currentUser.value?.providerData.map((p) => p.providerId) ?? [])

  let unsubscribe: Unsubscribe | null = null

  async function init() {
    try {
      const result = await getRedirectResult(auth)
      if (result?.user) {
        currentUser.value = result.user
      }
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "auth/credential-already-in-use") {
        console.warn(err)
        // ここで何をすべき？
        // 1. 既存のアカウントにサインインする
        // 2. 新しい認証情報をリンク
      }
      throw err
    }

    if (unsubscribe) unsubscribe()
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      currentUser.value = user
      if (user) {
        await _initializeUserData(user)
      } else {
        _clearUserData()
      }

      loading.value = false
      authReadyResolve()
    })
  }

  async function ensureReady() {
    return authReadyPromise
  }

  function _clearUserData() {
    const entryStore = useEntryStore()
    const commentStore = useCommentStore()
    const tagStore = useTagStore()
    const dataTransferStore = useDataTransferStore()

    storageService.value = null
    entryStore.reset()
    commentStore.reset()
    tagStore.reset()
    dataTransferStore.reset()
  }

  async function _initializeUserData(user: User) {
    const entryStore = useEntryStore()
    const tagStore = useTagStore()

    let backend
    if (!storageService.value) {
      backend = import.meta.env.VITE_STORAGE_BACKEND
    }
    if (backend === "local") {
      storageService.value = createStorageService({ backend: "local" })
    } else if (backend === "firestore") {
      storageService.value = createStorageService({ backend: "firestore", uid: user.uid })
    } else {
      throw new Error(`Invalid backend`)
    }

    await Promise.all([entryStore.fetchEntriesWithRelations(), tagStore.fetchTags()])
  }

  async function reloadUser() {
    currentUser.value?.reload()
  }

  async function signInWithPassword(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
    currentUser.value = auth.currentUser
  }

  async function signInAnonymously_() {
    await signInAnonymously(auth)
    currentUser.value = auth.currentUser
  }

  async function signUpWithPassword(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password)
    currentUser.value = auth.currentUser
  }

  async function validatePassword_(password: string) {
    const status = await validatePassword(auth, password)
    return status.isValid
  }

  function sendEmailVerification_() {
    if (!auth.currentUser) return
    sendEmailVerification(auth.currentUser)
  }

  async function linkWithProvider(providerId: "google.com") {
    if (!auth.currentUser) throw new Error("User not found")

    let provider
    if (providerId === "google.com") {
      provider = new GoogleAuthProvider()
    } else {
      throw new Error("Provider not found")
    }

    await linkWithRedirect(auth.currentUser, provider)
    await auth.currentUser.reload()
  }

  async function unlinkProvider(providerId: string) {
    if (!auth.currentUser) throw new Error("User not found")

    await unlink(auth.currentUser, providerId)
    await auth.currentUser.reload()
  }

  async function signInWithProvider(providerId: "google.com") {
    let provider
    if (providerId === "google.com") {
      provider = new GoogleAuthProvider()
    } else {
      throw new Error(`Unknown provider ${providerId}`)
    }

    await signInWithRedirect(auth, provider)
  }

  async function linkWithPassword(password: string) {
    const email = auth.currentUser?.email
    if (!email) return
    if (!auth.currentUser) throw new Error("No current user to link")
    const cred = EmailAuthProvider.credential(email, password)
    await linkWithCredential(auth.currentUser, cred)
  }

  async function signOut_() {
    await signOut(auth)
  }

  async function reauthenticateWithPassword(password: string) {
    if (!currentUser.value || !currentUser.value.email)
      throw new Error("Email auth has not registered")
    const cred = EmailAuthProvider.credential(currentUser.value.email, password)
    await reauthenticateWithCredential(currentUser.value, cred)
  }

  async function updatePassword_(password: string) {
    if (!currentUser.value) return
    await updatePassword(currentUser.value, password)
  }

  return {
    isLoggedIn,
    isAnonymous,
    email,
    emailVerified,
    providers,
    init,
    ensureReady,
    reloadUser,
    signInWithProvider,
    signInWithPassword,
    signInAnonymously: signInAnonymously_,
    sendEmailVerification: sendEmailVerification_,
    linkWithProvider,
    unlinkProvider,
    validatePassword: validatePassword_,
    signUpWithPassword,
    linkWithPassword,
    signOut: signOut_,
    reauthenticateWithPassword,
    updatePassword: updatePassword_,
  }
})
