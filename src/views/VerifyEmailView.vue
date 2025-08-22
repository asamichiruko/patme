<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()
const { trigger } = useNotificationBar()

async function resendEmailVerification() {
  try {
    authStore.sendEmailVerification()
  } catch (err) {
    console.error(err)
    trigger("アカウント認証メールの再送に失敗しました", "error")
  }
}

async function tryLogin() {
  if (!authStore.currentUser) return
  await authStore.currentUser.reload()
  router.push("/main")
}
</script>

<template>
  <header>
    <div class="index-title">
      <h1><img :src="patmeImg" alt="" width="20px" height="20px" />ふりかえり帖</h1>
    </div>
  </header>

  <div class="container">
    <h2>アカウント認証</h2>
    <p>
      登録したメールアドレス宛にアカウント認証メールを送信しました。認証を完了するため、メール内のリンクにアクセスしてください。
    </p>
    <p>
      <button type="button" class="primary-button" @click="tryLogin">ログイン（認証完了後）</button>
    </p>
    <p>
      アカウント認証メールが迷惑メールとして振り分けられる場合があります。メールが届かない場合はそちらを確認し、それでもメールが受け取れない場合は以下のボタンから再送してください。
    </p>
    <p>
      <button type="button" class="sub-button" @click="resendEmailVerification">
        アカウント認証メールを再送する
      </button>
    </p>
  </div>
</template>

<style scoped>
header {
  margin-bottom: 32px;
}

.index-title {
  color: var(--color-header);
  text-align: center;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

.index-title h1 {
  font-size: 24px;
  margin: 0;
  padding: 0;
}

.index-title img {
  margin-right: 8px;
}
</style>
