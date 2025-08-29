<script setup lang="ts">
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const authStore = useAuthStore()
const router = useRouter()
const { trigger } = useNotificationBar()

const emailView = computed(() => authStore.email ?? "--")
const email = ref("")
const password = ref("")
const loading = ref(false)
const hasPasswordAuth = computed(() => authStore.providers.includes("password"))

async function onSubmit() {
  if (!password.value || !authStore.isLoggedIn) return
  loading.value = true
  try {
    if (authStore.isAnonymous) {
      await authStore.linkWithPassword(email.value, password.value)
      authStore.sendEmailVerification()
      trigger("アカウントを仮登録し、アドレス認証メールを送信しました", "success")
      router.push("/verify_email?redirect=/account_settings")
    } else {
      if (!authStore.email) throw new Error("Email not found")
      await authStore.linkWithPassword(authStore.email, password.value)
      authStore.sendEmailVerification()
      trigger("パスワードを登録し、アドレス認証メールを送信しました", "success")
      router.push("/verify_email?redirect=/account_settings")
    }
  } catch (err) {
    console.error(err)
    trigger(
      "パスワードの登録に失敗しました。メールアドレス・パスワードをご確認の上、改めてお試しください",
      "error",
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form>
    <label v-if="authStore.isAnonymous">
      <span class="input-label">メールアドレス</span>
      <input
        v-model="email"
        class="input-text"
        name="email"
        type="email"
        placeholder="メールアドレス"
      />
    </label>
    <div v-else>
      <span class="input-label">メールアドレス</span>
      <span class="input-fixed-item">{{ emailView }}</span>
    </div>
    <template v-if="!hasPasswordAuth">
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
      <p>
        注：パスワードは 8 文字以上で、英小文字・英大文字・数字のすべてを含めて作成してください。
      </p>
      <p>
        パスワード認証の追加を行った場合はアドレス認証が必要になります。アドレス認証メールを送信いたしますので、そちらをご確認ください。
      </p>
      <button type="button" class="primary-button" @click="onSubmit">
        <LoadingSpinner class="spinner" v-if="loading" />
        <span class="button-label">パスワード認証の追加</span>
      </button>
    </template>
    <template v-else>
      <div>
        <span class="input-label">パスワード</span>
        <span class="input-fixed-item">********</span>
      </div>
    </template>
  </form>
</template>

<style scoped>
form {
  margin: 0;
  padding: 0;
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
  display: inline-block;
  padding: 4px;
  font-size: 15px;
  width: 250px;
}
.input-fixed-item {
  display: inline-block;
  width: 250px;
}
</style>
