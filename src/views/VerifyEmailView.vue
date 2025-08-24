<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { useRoute, useRouter } from "vue-router"

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { trigger } = useNotificationBar()

async function resendEmailVerification() {
  try {
    authStore.sendEmailVerification()
    trigger("アカウント認証メールを再送しました。", "success")
  } catch (err) {
    console.error(err)
    trigger("アカウント認証メールの再送に失敗しました", "error")
  }
}

async function tryLogin() {
  if (!authStore.currentUser) return
  await authStore.currentUser.reload()
  if (authStore.currentUser.emailVerified) {
    const redirect = route.query.redirect as string | undefined
    router.push(redirect ?? "/main")
  } else {
    trigger("先に認証を完了してください", "error")
  }
}
</script>

<template>
  <header class="main-header">
    <div class="main-title">
      <h1><img :src="patmeImg" alt="" width="20px" height="20px" />ふりかえり帖</h1>
    </div>
  </header>

  <div class="container">
    <h2>アカウント認証</h2>
    <p>
      登録したメールアドレス宛にアカウント認証メールを送信しました。認証を完了するため、メール内のリンクにアクセスしてください。
    </p>
    <p class="button-paragraph">
      <button type="button" class="primary-button" @click="tryLogin">ログイン（認証完了後）</button>
    </p>
    <h2>認証メールの再送</h2>
    <p>
      アカウント認証メールが迷惑メールとして振り分けられる場合があります。メールが届かない場合はそちらを確認し、それでもメールが受け取れない場合は以下のボタンから再送してください。
    </p>
    <p class="button-paragraph">
      <button type="button" class="sub-button" @click="resendEmailVerification">
        アカウント認証メールを再送する
      </button>
    </p>
  </div>
</template>

<style scoped>
.button-paragraph {
  margin: 16px 0;
}
</style>
