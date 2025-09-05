<script setup lang="ts">
import LoadingSpinner from "@/components/util/LoadingSpinner.vue"
import PageHeader from "@/components/util/PageHeader.vue"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { ref } from "vue"
import { useRouter } from "vue-router"

const { trigger } = useNotificationBar()
const authStore = useAuthStore()
const router = useRouter()

const email = ref("")
const password = ref("")
const loading = ref(false)

async function signUpAndLogin() {
  if (loading.value) return
  if (!email.value) {
    trigger("メールアドレスを入力してください", "error")
    return
  }
  if (!password.value) {
    trigger("パスワードを入力してください", "error")
    return
  }

  try {
    loading.value = true
    let isValid
    try {
      isValid = await authStore.validatePassword(password.value)
    } catch (err) {
      console.error(err)
      const re = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[!-~]{8,100}$/
      isValid = re.test(password.value)
    }
    if (!isValid) {
      trigger(
        "パスワードは 8 文字以上で、英小文字・英大文字・数字のすべてを含めて作成してください",
        "error",
      )
      return
    }

    await authStore.signUpWithPassword(email.value, password.value)
    authStore.sendEmailVerification()
    trigger("アカウントを仮登録し、アドレス認証メールを送信しました", "success")
    router.push("/verify_email")
  } catch (err) {
    console.error("Faild sign up with email", err)
    trigger("アカウント登録に失敗しました。メールアドレス・パスワードをご確認ください", "error")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <PageHeader :show-account-nav="false" :logoTo="'/login'" />
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
      <p>
        注：パスワードは 8 文字以上で、英小文字・英大文字・数字のすべてを含めて作成してください。
      </p>
      <button type="button" class="primary-button" @click="signUpAndLogin">
        <LoadingSpinner v-if="loading" />
        <span class="button-label">登録</span>
      </button>
    </form>
    <p><RouterLink to="/login" class="sub-button">既存のアカウントでログインする</RouterLink></p>
  </div>
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

section {
  margin-bottom: 24px;
}
h2 {
  padding-bottom: 8px;
}
</style>
