<script setup lang="ts">
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const authStore = useAuthStore()
const router = useRouter()
const { trigger } = useNotificationBar()

const emailView = computed(() => authStore.currentUser?.email ?? "--")
const password = ref("")
const loading = ref(false)
const hasPasswordAuth = ref(false)

onMounted(async () => {
  hasPasswordAuth.value = await authStore.hasPasswordProvider()
})

async function onSubmit() {
  if (!authStore.currentUser?.email || !password.value) return
  loading.value = true
  try {
    await authStore.linkWithPassword(authStore.currentUser.email, password.value)
    authStore.sendEmailVerification()
    trigger("パスワードを登録し、アドレス認証メールを送信しました", "success")
    hasPasswordAuth.value = await authStore.hasPasswordProvider()
    router.push("/verify_email?redirect=/account_settings")
  } catch (err) {
    console.error(err)
    trigger(
      "パスワードの登録に失敗しました。入力したパスワードをご確認の上、改めてお試しください",
      "error",
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form>
    <div>
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
        <LoadingSpinner class="spinner" v-if="loading" /> パスワード認証の追加
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
  display: inline-block;
  padding: 4px;
  font-size: 15px;
  width: 250px;
}
.input-fixed-item {
  display: inline-block;
  width: 250px;
}

.spinner {
  width: 16px;
  height: 16px;
  color: var(--color-primary-text);
}
</style>
