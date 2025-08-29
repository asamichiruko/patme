import { auth } from "@/firebase"
import { FirebaseError } from "firebase/app"
import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getRedirectResult,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithRedirect,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithRedirect,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  unlink,
  updatePassword,
  validatePassword,
  type User,
  type UserCredential,
} from "firebase/auth"

const PROVIDER_ID_KEY = "firebaseAuth_providerId"
const ACTION_KEY = "firebaseAuth_action"
const GOOGLE_PROVIDER_ID = "google.com"

async function initialize(onStateChange: (user: User | null) => void) {
  try {
    const result = await getRedirectResult(auth)
    if (result) {
      await _handleRedirectResult(result)
      onStateChange(result.user)
    }
  } catch (err) {
    console.error(err)
  }

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    onStateChange(user)
  })

  return unsubscribe
}

async function _handleRedirectResult(result: UserCredential) {
  const action = sessionStorage.getItem(ACTION_KEY)
  const providerId = sessionStorage.getItem(PROVIDER_ID_KEY)

  if (action === "unlink" && providerId) {
    await unlink(result.user, providerId as string)
  } else if (action === "link" && providerId) {
    if (
      providerId === "google.com" &&
      !result.user.providerData.some((p) => p.providerId === "google.com")
    ) {
      const authCredential = GoogleAuthProvider.credentialFromResult(result)
      if (authCredential) linkWithCredential(result.user, authCredential)
    }
  }

  sessionStorage.removeItem(ACTION_KEY)
  sessionStorage.removeItem(PROVIDER_ID_KEY)
}

const emailProvider = {
  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  },
  async signUp(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  },
  async link(user: User, email: string, password: string) {
    const userCredential = EmailAuthProvider.credential(email, password)
    await linkWithCredential(user, userCredential)
  },
  async updatePassword(user: User, password: string): Promise<void> {
    await updatePassword(user, password)
  },
  async reauthenticateWithPassword(user: User, password: string) {
    if (!user.email) throw new Error("User email is not available")
    const userCredential = EmailAuthProvider.credential(user.email, password)
    await reauthenticateWithCredential(user, userCredential)
  },
}

const googleProvider = {
  async signIn() {
    const provider = new GoogleAuthProvider()
    await signInWithRedirect(auth, provider)
  },
  async link(user: User) {
    const provider = new GoogleAuthProvider()

    sessionStorage.setItem(ACTION_KEY, "link")
    sessionStorage.setItem(PROVIDER_ID_KEY, GOOGLE_PROVIDER_ID)

    try {
      linkWithRedirect(user, provider)
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "auth/requires-recent-login") {
        await reauthenticateWithRedirect(user, provider)
      } else {
        console.error(err)
        throw err
      }
    }
  },
  async unlink(user: User) {
    if (user.providerData.length === 1) {
      throw new Error("User must have at least one provider")
    }
    if (!user.providerData.some((p) => p.providerId === GOOGLE_PROVIDER_ID)) {
      throw new Error("Provider is not linked")
    }

    const provider = new GoogleAuthProvider()

    try {
      await unlink(user, GOOGLE_PROVIDER_ID)
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "auth/requires-recent-login") {
        sessionStorage.setItem(ACTION_KEY, "unlink")
        sessionStorage.setItem(PROVIDER_ID_KEY, GOOGLE_PROVIDER_ID)
        await reauthenticateWithRedirect(user, provider)
      } else {
        throw err
      }
    }
  },
}

async function signInAnonymously_() {
  const userCredential = await signInAnonymously(auth)
  return userCredential.user
}

async function signOut_() {
  await signOut(auth)
}

async function reloadUser(user: User) {
  await user.reload()
  await user.getIdToken(true)
}

async function sendEmailVerification_(user: User) {
  await sendEmailVerification(user)
}

async function sendPasswordResetEmail_(email: string) {
  await sendPasswordResetEmail(auth, email)
}

async function validatePassword_(password: string) {
  const status = await validatePassword(auth, password)
  return status.isValid
}

async function deleteUser_(user: User) {
  await deleteUser(user)
}

export const authService = {
  initialize,
  emailProvider,
  googleProvider,
  signInAnonymously: signInAnonymously_,
  signOut: signOut_,
  reloadUser,
  sendEmailVerification: sendEmailVerification_,
  sendPasswordResetEmail: sendPasswordResetEmail_,
  validatePassword: validatePassword_,
  deleteUser: deleteUser_,
}
