<script setup lang="ts">
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { computed, ref } from "vue"

const authStore = useAuthStore()
const { trigger } = useNotificationBar()

const linkedProviders = computed(() => authStore.signInMethods())
const isPasswordLinked = computed(() => linkedProviders.value.includes("password"))
const isGoogleLinked = computed(() => linkedProviders.value.includes("google.com"))

const updating = ref(false)

async function linkWithProvider(provider: string) {
  updating.value = true
  try {
    await authStore.linkWithProvider(provider as "google.com")
  } catch (err) {
    console.warn(err)
    trigger("プロバイダ連携に失敗しました", "error")
  } finally {
    updating.value = false
  }
}

async function unlinkProvider(provider: string) {
  updating.value = true
  try {
    await authStore.unlinkProvider(provider)
  } finally {
    updating.value = false
  }
}
</script>

<template>
  <form>
    <table class="auth-methods">
      <thead>
        <tr>
          <th>認証方法</th>
          <th>登録状態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>パスワード</td>
          <td>{{ isPasswordLinked ? "登録済み" : "未登録" }}</td>
          <td>--</td>
        </tr>
        <tr>
          <td>Google</td>
          <td>{{ isGoogleLinked ? "登録済み" : "未登録" }}</td>
          <td>
            <button
              v-if="isGoogleLinked"
              class="warning-button slim-button"
              @click="unlinkProvider('google.com')"
            >
              登録解除
            </button>
            <button
              v-else
              class="primary-button slim-button"
              @click="linkWithProvider('google.com')"
            >
              登録
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
  <p>注：いずれかの認証方法が登録されている必要があります。</p>
</template>

<style scoped>
form {
  margin: 0;
  padding: 0;
  margin-bottom: 16px;
}

table.auth-methods {
  border-spacing: 0;
  display: block;
  width: 100%;
  overflow: scroll;
}

table.auth-methods tbody {
  white-space: nowrap;
}

table.auth-methods th,
table.auth-methods td {
  padding: 4px 16px;
}

table.auth-methods th {
  color: var(--color-header);
}

table.auth-methods td:last-of-type {
  text-align: center;
}

.slim-button {
  font-size: 15px;
  padding: 4px 12px;
}

.spinner {
  width: 16px;
  height: 16px;
  color: var(--color-primary-text);
}
</style>
