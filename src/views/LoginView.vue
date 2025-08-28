<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import LoadingSpinner from "@/components/util/LoadingSpinner.vue"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { ref } from "vue"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const { trigger } = useNotificationBar()
const router = useRouter()

const email = ref("")
const password = ref("")
const loading = ref<string | null>(null)

const signInAnonymously = async () => {
  loading.value = "anonymous"
  try {
    await authStore.signInAnonymously()
    router.push("/main")
  } catch {
    trigger("ログインに失敗しました", "error")
  } finally {
    loading.value = null
  }
}

const signInWithGoogle = async () => {
  loading.value = "google"
  try {
    if (!authStore.isLoggedIn) {
      await authStore.signInWithGoogle()
    } else if (authStore.isAnonymous) {
      await authStore.linkWithGoogle()
    } else {
      throw new Error("User already loggedin")
    }
  } catch (err) {
    console.warn(err)
    trigger("ログインに失敗しました", "error")
  } finally {
    loading.value = null
  }
}

const signInWithPassword = async () => {
  loading.value = "email"
  try {
    await authStore.signInWithPassword(email.value, password.value)
    router.push("/main")
  } catch {
    trigger("ログインに失敗しました。メールアドレスとパスワードをご確認ください", "error")
  } finally {
    loading.value = null
  }
}
</script>

<template>
  <header class="index-header">
    <div class="index-title">
      <h1><img :src="patmeImg" alt="" width="30px" height="30px" />ふりかえり帖</h1>
      <p class="index-subtitle">Give yourself a pat on the back!</p>
    </div>
  </header>
  <div class="container">
    <h2>このアプリについて</h2>
    <p>
      ふりかえり帖 (Patme)
      は日常の「できたこと」や「ふりかえりたいこと」を記録し、自分を客観的にふりかえるためのアプリです。
    </p>

    <h2>ログイン</h2>
    <form>
      <fieldset>
        <legend>アカウント連携</legend>
        <button type="button" class="primary-button" @click="signInWithGoogle">
          <LoadingSpinner v-if="loading === 'google'" class="spinner" /> Google アカウントでログイン
        </button>
      </fieldset>
      <fieldset>
        <legend>パスワードでログイン</legend>
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
        <button type="button" class="primary-button" @click="signInWithPassword">
          <LoadingSpinner v-if="loading === 'email'" class="spinner" />
          パスワードでログイン
        </button>
        <p><RouterLink to="./reset_password">パスワードを忘れた場合（再発行）</RouterLink></p>
      </fieldset>
      <fieldset>
        <legend>アカウントの新規登録</legend>
        <RouterLink class="primary-button" to="/signup">新規登録</RouterLink>
        <button type="button" class="primary-button" @click="signInAnonymously">
          <LoadingSpinner v-if="loading === 'anonymous'" class="spinner" /> 登録せずにログイン
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

.index-header {
  margin-bottom: 16px;
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
  gap: 8px;
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

.spinner {
  width: 16px;
  height: 16px;
  color: var(--color-primary-text);
}
</style>
