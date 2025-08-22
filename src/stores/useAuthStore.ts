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
  signInWithCredential,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  sendEmailVerification,
  validatePassword,
} from "firebase/auth"
import { defineStore } from "pinia"
import { ref } from "vue"

let authReadyResolve: () => void
const authReadyPromise = new Promise<void>((resolve) => {
  authReadyResolve = resolve
})

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref<User | null>(null)
  const loading = ref(true)

  let unsubscribe: Unsubscribe | null = null

  async function init() {
    try {
      const result = await getRedirectResult(auth)
      if (result?.user) {
        currentUser.value = result.user
      }
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "auth/credential-already-in-use") {
        // credential login
      }
    }

    if (unsubscribe) unsubscribe()
    unsubscribe = onAuthStateChanged(auth, (user) => {
      currentUser.value = user
      loading.value = false

      authReadyResolve()
    })
  }

  async function ensureReady() {
    return authReadyPromise
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    await signInWithRedirect(auth, provider)
  }

  async function signInWithPassword(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
    currentUser.value = auth.currentUser
  }

  async function _signInAnonymously() {
    await signInAnonymously(auth)
    currentUser.value = auth.currentUser
  }

  async function signUpWithPassword(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password)
    currentUser.value = auth.currentUser
  }

  async function _validatePassword(password: string) {
    const status = await validatePassword(auth, password)
    return status.isValid
  }

  function _sendEmailVerification() {
    if (!auth.currentUser) return
    sendEmailVerification(auth.currentUser)
  }

  async function linkAnonymousWithGoogle() {
    if (!auth.currentUser) throw new Error("No current user to link")
    if (!auth.currentUser.isAnonymous) {
      throw new Error("Not anonymous user")
    }
    const provider = new GoogleAuthProvider()
    try {
      await linkWithRedirect(auth.currentUser, provider)
    } catch (err) {
      if (!(err instanceof FirebaseError)) throw err
      if (err.code === "auth/credential-already-in-use") {
        const cred = GoogleAuthProvider.credentialFromError(err)
        if (cred) {
          await signInWithCredential(auth, cred)
        }
      } else {
        throw err
      }
    }
  }

  async function linkAnonymousWithPassword(email: string, password: string) {
    if (!auth.currentUser) throw new Error("No current user to link")
    if (!auth.currentUser.isAnonymous) {
      throw new Error("Not anonymous user")
    }
    const cred = EmailAuthProvider.credential(email, password)
    try {
      await linkWithCredential(auth.currentUser, cred)
    } catch (err) {
      if (!(err instanceof FirebaseError)) throw err
      if (err.code === "auth/credential-already-in-use") {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        throw err
      }
    }
  }

  async function signOutAll() {
    await signOut(auth)
  }

  return {
    currentUser,
    loading,
    init,
    ensureReady,
    signInWithGoogle,
    signInWithPassword,
    signInAnonymously: _signInAnonymously,
    sendEmailVerification: _sendEmailVerification,
    validatePassword: _validatePassword,
    signUpWithPassword,
    linkAnonymousWithGoogle,
    linkAnonymousWithPassword,
    signOutAll,
  }
})
