<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { ref } from "vue"
import { useRouter } from "vue-router"

const { trigger } = useNotificationBar()
const router = useRouter()
const authStore = useAuthStore()

const email = ref("")
const password = ref("")

async function signUpAndLogin() {
  if (!email.value) {
    trigger("メールアドレスを入力してください", "error")
    return
  }
  if (!password.value) {
    trigger("パスワードを入力してください", "error")
    return
  }
  if (password.value.length < 8) {
    trigger("パスワードは 8 文字以上で作成してください", "error")
    return
  }

  try {
    await authStore.signUpWithEmail(email.value, password.value)
    trigger("アカウントを登録しました", "success")
  } catch (err) {
    console.error("Faild sign up with email", err)
    trigger("アカウント登録に失敗しました。メールアドレス・パスワードをご確認ください", "error")
    return
  }

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
    <h2>アカウントの新規登録</h2>
    <form>
      <label>
        <span class="input-label">メールアドレス</span>
        <input
          v-model="email"
          class="input-text"
          name="email"
          type="email"
          placeholder="メールアドレス"
        />
      </label>
      <label>
        <span class="input-label">パスワード</span>
        <input
          v-model="password"
          class="input-text"
          name="password"
          type="password"
          placeholder="パスワード"
        />
      </label>
      <p>注：パスワードは 8 文字以上で作成してください。</p>
      <button type="button" class="primary-button" @click="signUpAndLogin">登録</button>
    </form>
    <p><a href="./login">既存のアカウントでログインする</a></p>
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

p {
  margin: 0;
  padding: 0;
}

form {
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  margin-bottom: 32px;
}

.input-label {
  display: inline-block;
  width: 130px;
}
.input-text {
  padding: 4px;
  font-size: 15px;
  width: 250px;
}
</style>
