import { auth } from "@/firebase"
import {
  getRedirectResult,
  onAuthStateChanged,
  signInAnonymously,
  signInWithRedirect,
  signOut,
  GoogleAuthProvider,
  type Unsubscribe,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref<User | null>(null)
  const redirectChecked = ref(false)
  const loading = ref(true)
  const error = ref<unknown>(null)

  let unsubscribe: Unsubscribe | null = null

  function initAuthListener() {
    if (unsubscribe) return
    unsubscribe = onAuthStateChanged(auth, (u) => {
      currentUser.value = u
      loading.value = false
    })
  }

  async function checkRedirectResultOnce() {
    if (redirectChecked.value) return
    try {
      const result = await getRedirectResult(auth)
      if (result?.user) currentUser.value = result.user
      redirectChecked.value = true
    } catch (err) {
      console.error("Failed getRedirectResult", err)
      error.value = err
    }
  }

  async function ensureReady() {
    initAuthListener()
    await checkRedirectResultOnce()
    if (loading.value) {
      await new Promise<void>((resolve) => {
        const off = onAuthStateChanged(auth, () => {
          off()
          resolve()
        })
      })
    }
  }

  async function signUpWithEmail(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    currentUser.value = cred.user
    return cred.user
  }

  async function signInWithEmail(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    currentUser.value = cred.user
    return cred.user
  }

  async function signInWithGoogleRedirect() {
    error.value = null
    const provider = new GoogleAuthProvider()
    await signInWithRedirect(auth, provider)
  }

  async function signInAnonymous() {
    error.value = null
    await signInAnonymously(auth)
  }

  async function signOutAll() {
    error.value = null
    await signOut(auth)
  }

  function dispose() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    currentUser,
    loading,
    redirectChecked,
    error,
    initAuthListener,
    checkRedirectResultOnce,
    ensureReady,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogleRedirect,
    signInAnonymous,
    signOutAll,
    dispose,
  }
})
