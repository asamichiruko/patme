<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import { auth } from "@/firebase"
import {
  GoogleAuthProvider,
  linkWithPopup,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth"
import { useRouter } from "vue-router"

const router = useRouter()

const signInAsAnonymous = async () => {
  try {
    await signInAnonymously(auth)
    router.push("/main")
  } catch (err) {
    console.error("Login error:", err)
  }
}

const signInWithGoogleAccount = async () => {
  try {
    const provider = new GoogleAuthProvider()
    if (auth.currentUser && auth.currentUser.isAnonymous) {
      await linkWithPopup(auth.currentUser, provider)
    } else {
      await signInWithPopup(auth, provider)
    }
  } catch (err) {
    console.error("Login error:", err)
  }
}
</script>

<template>
  <header>
    <div class="index-title">
      <h1><img :src="patmeImg" alt="" width="30px" height="30px" />ふりかえり帖</h1>
      <p>Give yourself a pat on the back!</p>
    </div>
  </header>
  <div class="container">
    <h2>このアプリについて</h2>
    <p>
      ふりかえり帖 (Patme)
      は日常の「できたこと」や「ふりかえりたいこと」を記録し、自分を客観的にふりかえるためのアプリです。
    </p>
    <h2>ログイン</h2>
    <p><button class="login-button" @click="signInAsAnonymous">匿名でログイン</button></p>
    <p>
      <button class="login-button" @click="signInWithGoogleAccount">
        Google アカウントでログイン
      </button>
    </p>
    <p>注：匿名でログインした場合、ブラウザを変更するとデータが引き継がれません。</p>
    <p>Google アカウントでログインすると異なる端末間でデータを共有できます。</p>
    <h2>その他事項</h2>
    <ul>
      <li><a href="https://github.com/asamichiruko/patme">GitHub リポジトリ</a></li>
    </ul>
  </div>
</template>

<style scoped>
.index-title {
  color: var(--color-header);
  text-align: center;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

.index-title h1 {
  font-size: 32px;
  margin: 0;
  padding: 0;
  margin-top: 48px;
}

.index-title img {
  margin-right: 8px;
}

.index-title p {
  font-size: 18px;
  margin: 0;
  padding: 0;
  margin-bottom: 16px;
}

h2 {
  color: var(--color-header);
}

.login-button {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}
.login-button:hover {
  background-color: var(--color-primary-hover);
}
.login-button:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
