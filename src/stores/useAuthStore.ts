import type { User, Unsubscribe } from "firebase/auth"
import { defineStore } from "pinia"
import { computed, ref, watch } from "vue"
import { authService } from "@/services/authService"

let readyPromise: Promise<void> | null = null

export const useAuthStore = defineStore("auth", () => {
  // State
  const currentUser = ref<User | null>(null)
  let unsubscribe: Unsubscribe | null = null
  const loading = ref(true)

  // Getters
  const isLoggedIn = computed(() => !!currentUser.value)
  const uid = computed(() => currentUser.value?.uid ?? null)
  const isAnonymous = computed(() => currentUser.value?.isAnonymous ?? false)
  const email = computed(() => currentUser.value?.email ?? null)
  const emailVerified = computed(() => currentUser.value?.emailVerified ?? false)
  const providers = computed(() => currentUser.value?.providerData.map((p) => p.providerId) ?? [])

  // Actions
  async function init() {
    if (readyPromise) return readyPromise

    readyPromise = new Promise(async (resolve) => {
      const unwatch = watch(loading, (isLoading) => {
        if (!isLoading) {
          resolve()
          unwatch()
        }
      })

      if (unsubscribe) unsubscribe()
      unsubscribe = await authService.initialize((user) => {
        currentUser.value = user
        if (loading.value) {
          loading.value = false
        }
      })
    })

    return readyPromise
  }

  async function ensureReady(): Promise<void> {
    return init()
  }

  async function reloadUser() {
    if (!currentUser.value) return
    await authService.reloadUser(currentUser.value)
    currentUser.value = { ...currentUser.value }
  }

  async function signInWithPassword(email: string, password: string) {
    const user = await authService.emailProvider.signIn(email, password)
    currentUser.value = user
  }

  async function signInAnonymously() {
    const user = await authService.signInAnonymously()
    currentUser.value = user
  }

  async function signUpWithPassword(email: string, password: string) {
    const user = await authService.emailProvider.signUp(email, password)
    currentUser.value = user
  }

  async function validatePassword(password: string) {
    return await authService.validatePassword(password)
  }

  async function sendEmailVerification() {
    if (!currentUser.value) return
    await authService.sendEmailVerification(currentUser.value)
  }

  async function linkWithGoogle() {
    if (!currentUser.value) throw new Error("User not found")
    await authService.googleProvider.link(currentUser.value)
  }

  async function unlinkGoogle() {
    if (!currentUser.value) throw new Error("User not found")
    await authService.googleProvider.unlink(currentUser.value)
  }

  async function signInWithGoogle() {
    await authService.googleProvider.signIn()
  }

  async function linkWithPassword(email: string, password: string) {
    if (!currentUser.value) throw new Error("No current user to link")

    await authService.emailProvider.link(currentUser.value, email, password)
  }

  async function signOut() {
    await authService.signOut()
    currentUser.value = null
  }

  async function reauthenticateWithPassword(password: string) {
    if (!currentUser.value) throw new Error("User not found")
    if (!email.value) throw new Error("Email not found")

    await authService.emailProvider.reauthenticateWithPassword(
      currentUser.value,
      email.value,
      password,
    )
  }

  async function updatePassword(password: string) {
    if (!currentUser.value) throw new Error("User not found")
    await authService.emailProvider.updatePassword(currentUser.value, password)
  }

  async function deleteUser() {
    if (!currentUser.value) throw new Error("User not found")
    await authService.deleteUser(currentUser.value)
    currentUser.value = null
  }

  return {
    currentUser,
    loading,
    uid,
    isLoggedIn,
    isAnonymous,
    email,
    emailVerified,
    providers,
    init,
    ensureReady,
    reloadUser,
    signInWithGoogle,
    signInWithPassword,
    signInAnonymously,
    sendEmailVerification,
    linkWithGoogle,
    unlinkGoogle,
    validatePassword,
    signUpWithPassword,
    linkWithPassword,
    signOut,
    deleteUser,
    reauthenticateWithPassword,
    updatePassword,
  }
})
