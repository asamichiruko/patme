<script setup lang="ts">
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { computed, ref } from "vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const authStore = useAuthStore()
const { trigger } = useNotificationBar()

type ProviderId = "google.com"

const isPasswordLinked = computed(() => authStore.providers.includes("password"))
const isGoogleLinked = computed(() => authStore.providers.includes("google.com"))
const canUnlink = computed(() => authStore.providers.length > 1)
const loadingProvider = ref<ProviderId | null>(null)
const loadingType = ref<"link" | "unlink" | null>(null)

const updating = computed(() => loadingProvider.value !== null && loadingType.value !== null)

async function linkWithProvider(providerId: ProviderId) {
  if (updating.value) return
  loadingProvider.value = providerId
  loadingType.value = "link"
  try {
    if (providerId === "google.com") {
      await authStore.linkWithGoogle()
    } else {
      throw new Error("Unknown provider")
    }
  } catch (err) {
    console.error(err)
    trigger("プロバイダ連携に失敗しました", "error")
  } finally {
    loadingProvider.value = null
    loadingType.value = null
  }
}

async function unlinkProvider(providerId: ProviderId) {
  if (updating.value) return
  loadingProvider.value = providerId
  loadingType.value = "unlink"
  try {
    if (providerId === "google.com") {
      await authStore.unlinkGoogle()
    } else {
      throw new Error("Unknown provider")
    }
  } catch (err) {
    console.error(err)
    trigger("プロバイダ連携の解除に失敗しました", "error")
  } finally {
    loadingProvider.value = null
    loadingType.value = null
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
              v-if="isGoogleLinked && canUnlink"
              type="button"
              class="warning-button slim-button"
              @click="unlinkProvider('google.com')"
            >
              <LoadingSpinner v-if="loadingType === 'unlink' && loadingProvider === 'google.com'" />
              <span class="button-label">登録解除</span>
            </button>
            <button
              v-else-if="!isGoogleLinked"
              type="button"
              class="primary-button slim-button"
              @click="linkWithProvider('google.com')"
            >
              <LoadingSpinner v-if="loadingType === 'link' && loadingProvider === 'google.com'" />
              <span class="button-label">登録</span>
            </button>
            <span v-else>--</span>
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
</style>
