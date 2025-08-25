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
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  sendEmailVerification,
  validatePassword,
  fetchSignInMethodsForEmail,
  type AuthProvider,
  unlink,
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
      throw err
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

  async function fetchSignInMethods() {
    if (!auth.currentUser?.email) return []
    const methods = await fetchSignInMethodsForEmail(auth, auth.currentUser.email)
    return methods
  }

  function signInMethods() {
    if (!auth.currentUser?.providerData) return []
    return auth.currentUser.providerData.map((p) => p.providerId)
  }

  async function linkWithProvider(providerId: "google.com") {
    if (!auth.currentUser) throw new Error("User not found")

    let provider: AuthProvider
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

  async function signInWithGoogle() {
    if (!auth.currentUser) throw new Error("No current user to link")
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

  async function linkWithPassword(password: string) {
    const email = auth.currentUser?.email
    if (!email) return
    if (!auth.currentUser) throw new Error("No current user to link")
    const cred = EmailAuthProvider.credential(email, password)
    await linkWithCredential(auth.currentUser, cred)
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
    fetchSignInMethods,
    signInMethods,
    linkWithProvider,
    unlinkProvider,
    validatePassword: _validatePassword,
    signUpWithPassword,
    linkWithPassword,
    signOutAll,
  }
})
