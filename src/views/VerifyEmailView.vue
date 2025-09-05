<script setup lang="ts">
import LoadingSpinner from "@/components/util/LoadingSpinner.vue"
import PageHeader from "@/components/util/PageHeader.vue"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { trigger } = useNotificationBar()
const loading = ref(false)

async function resendEmailVerification() {
  try {
    if (loading.value) return
    loading.value = true
    authStore.sendEmailVerification()
    trigger("アカウント認証メールを再送しました。", "success")
  } catch (err) {
    console.error(err)
    trigger("アカウント認証メールの再送に失敗しました", "error")
  } finally {
    loading.value = false
  }
}

async function tryLogin() {
  await authStore.reloadUser()
  if (authStore.emailVerified) {
    const redirect = route.query.redirect as string | undefined
    router.push(redirect ?? "/main")
  } else {
    trigger("先に認証を完了してください", "error")
  }
}
</script>

<template>
  <PageHeader :show-account-nav="false" :logoTo="'/login'" />

  <div class="container">
    <section>
      <h2>アカウント認証</h2>
      <p>
        登録したメールアドレス宛にアカウント認証メールを送信しました。認証を完了するため、メール内のリンクにアクセスしてください。
      </p>
      <p class="button-paragraph">
        <button type="button" class="primary-button" @click="tryLogin">
          ログイン（認証完了後）
        </button>
      </p>
    </section>
    <section>
      <h2>認証メールの再送</h2>
      <p>
        アカウント認証メールが迷惑メールとして振り分けられる場合があります。メールが届かない場合はそちらを確認し、それでもメールが受け取れない場合は以下のボタンから再送してください。
      </p>
      <p>
        <button type="button" class="sub-button" @click="resendEmailVerification">
          <LoadingSpinner v-if="loading" />
          <span class="button-label">アカウント認証メールを再送する</span>
        </button>
      </p>
    </section>
  </div>
</template>

<style scoped>
section {
  margin-bottom: 24px;
}
h2 {
  padding-bottom: 8px;
}
</style>
