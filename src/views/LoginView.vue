<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import { useAuthStore } from "@/stores/useAuthStore"
import { ref } from "vue"

const authStore = useAuthStore()

const email = ref("")
const password = ref("")

const signInAsAnonymous = async () => {
  authStore.signInAnonymous()
}

const signInWithGoogleAccount = async () => {
  authStore.signInWithGoogleRedirect()
}

const signInWithEmail = async () => {
  await authStore.signInWithEmail(email.value, password.value)
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
    <p class="index-subtitle">
      ふりかえり帖 (Patme)
      は日常の「できたこと」や「ふりかえりたいこと」を記録し、自分を客観的にふりかえるためのアプリです。
    </p>

    <h2>ログイン</h2>
    <form>
      <fieldset>
        <legend>アカウント連携</legend>
        <button type="button" class="primary-button" @click="signInWithGoogleAccount">
          Google アカウントでログイン
        </button>
      </fieldset>
      <fieldset>
        <legend>メールアドレスでログイン</legend>
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
        <button type="button" class="primary-button" @click="signInWithEmail">
          メールアドレスでログイン
        </button>
        <p><a href="./reset_password">パスワードを忘れた場合（再発行）</a></p>
      </fieldset>
      <fieldset>
        <legend>アカウントの新規登録</legend>
        <button type="button" class="primary-button" @click="$router.push('/signup')">
          新規登録
        </button>
        <button type="button" class="primary-button" @click="signInAsAnonymous">
          登録せずにログイン
        </button>
        <p>
          注：アカウント登録せずにログインした場合、ブラウザを変更するとデータが引き継がれません。
        </p>
      </fieldset>
    </form>

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

.index-subtitle {
  font-size: 18px;
  margin: 0;
  padding: 0;
}

header {
  margin-bottom: 16px;
}

h2 {
  color: var(--color-header);
  font-size: 22px;
}

p {
  margin: 0;
  padding: 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

legend {
  font-weight: bold;
  font-size: 18px;
  color: var(--color-header);
  margin: 8px 0;
}

fieldset {
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
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
