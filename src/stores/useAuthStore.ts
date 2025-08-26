import { auth } from "@/firebase"
import {
  getRedirectResult,
  signInAnonymously,
  signOut,
  GoogleAuthProvider,
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
  deleteUser,
  reauthenticateWithRedirect,
  type UserCredential,
} from "firebase/auth"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useEntryStore } from "./useEntryStore"
import { useCommentStore } from "./useCommentStore"
import { useTagStore } from "./useTagStore"
import { useDataTransferStore } from "./useDataTransferStore"
import { createStorageService } from "@/services/createStorageService"
import type { StorageService } from "@/services/StorageService"
import { FirebaseError } from "firebase/app"

const PROVIDER_ID_KEY = "firebaseAuth_providerId"
const ACTION_KEY = "firebaseAuth_action"

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
      if (result) _handleRedirectResult(result)

      if (result?.user) {
        currentUser.value = result.user
      }
    } catch (err) {
      console.error(err)
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

  async function _handleRedirectResult(result: UserCredential) {
    const action = sessionStorage.getItem(ACTION_KEY)
    const providerId = sessionStorage.getItem(PROVIDER_ID_KEY) as string

    if (action === "unlink") {
      await unlink(result.user, providerId)
      await reloadUser()
    }

    sessionStorage.removeItem(ACTION_KEY)
    sessionStorage.removeItem(PROVIDER_ID_KEY)
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
    if (!auth.currentUser) return
    await auth.currentUser.reload()
    await auth.currentUser.getIdToken(true)
    currentUser.value = { ...auth.currentUser }
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

    sessionStorage.setItem(ACTION_KEY, "link")
    sessionStorage.setItem(PROVIDER_ID_KEY, providerId)

    await reauthenticateWithRedirect(auth.currentUser, provider)
  }

  async function unlinkProvider(providerId: string) {
    if (!auth.currentUser) throw new Error("User not found")

    if (auth.currentUser.providerData.length === 1) {
      throw new Error("User must have at least one provider")
    }
    if (!auth.currentUser.providerData.some((p) => p.providerId === providerId)) {
      throw new Error("Provider is not linked")
    }

    let provider
    if (providerId === "google.com") {
      provider = new GoogleAuthProvider()
    } else {
      throw new Error(`Unknown provider ${providerId}`)
    }

    try {
      await unlink(auth.currentUser, providerId)
      await reloadUser()
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "auth/requires-recent-login") {
        sessionStorage.setItem(ACTION_KEY, "unlink")
        sessionStorage.setItem(PROVIDER_ID_KEY, providerId)
        await reauthenticateWithRedirect(auth.currentUser, provider)
      } else {
        throw err
      }
    }
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
    if (!auth.currentUser) throw new Error("No current user to link")
    if (!auth.currentUser.email) return

    console.log("Current user UID:", auth.currentUser.uid)
    console.log("Current user email:", auth.currentUser.email)
    console.log("Current user isAnonymous:", auth.currentUser.isAnonymous)
    console.log(
      "Current user providers:",
      auth.currentUser.providerData.map((p) => p.providerId),
    )

    const cred = EmailAuthProvider.credential(auth.currentUser.email, password)
    await linkWithCredential(auth.currentUser, cred)
  }

  async function signOut_() {
    await signOut(auth)
  }

  async function reauthenticateWithPassword(password: string) {
    if (!auth.currentUser || !auth.currentUser.email)
      throw new Error("Email auth has not registered")
    const cred = EmailAuthProvider.credential(auth.currentUser.email, password)
    await reauthenticateWithCredential(auth.currentUser, cred)
  }

  async function updatePassword_(password: string) {
    if (!auth.currentUser) return
    await updatePassword(auth.currentUser, password)
  }

  async function deleteUser_() {
    if (!auth.currentUser) return
    await deleteUser(auth.currentUser)
    currentUser.value = auth.currentUser
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
    deleteUser: deleteUser_,
    reauthenticateWithPassword,
    updatePassword: updatePassword_,
  }
})
