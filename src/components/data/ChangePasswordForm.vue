<script setup lang="ts">
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { computed, ref } from "vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const authStore = useAuthStore()
const { trigger } = useNotificationBar()

const oldPassword = ref("")
const newPassword = ref("")
const loading = ref(false)
const hasPasswordAuth = computed(() => authStore.providers.includes("password"))

async function updatePassword() {
  loading.value = true
  try {
    try {
      await authStore.reauthenticateWithPassword(oldPassword.value)
    } catch (err) {
      console.error(err)
      trigger("ユーザの再認証に失敗しました。現在のパスワードが正しいことをご確認ください", "error")
      return
    }
    try {
      await authStore.updatePassword(newPassword.value)
      trigger("パスワードを更新しました", "success")
    } catch (err) {
      console.error(err)
      trigger("パスワードの更新に失敗しました。新しいパスワードの内容をご確認ください", "error")
      return
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form v-if="hasPasswordAuth">
    <label>
      <span class="input-label">現在のパスワード</span>
      <input
        v-model="oldPassword"
        class="input-text"
        name="password"
        type="password"
        placeholder="現在のパスワード"
      />
    </label>
    <label>
      <span class="input-label">新しいパスワード</span>
      <input
        v-model="newPassword"
        class="input-text"
        name="password"
        type="password"
        placeholder="新しいパスワード"
      />
    </label>
    <p>注：パスワードは 8 文字以上で、英小文字・英大文字・数字のすべてを含めて作成してください。</p>
    <button type="button" class="primary-button" @click="updatePassword">
      <LoadingSpinner class="spinner" v-if="loading" />
      <span class="button-label">パスワードの更新</span>
    </button>
  </form>
  <p v-else>パスワードの更新はパスワード認証を登録しているユーザのみ行えます。</p>
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
  width: 140px;
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
