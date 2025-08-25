<script setup lang="ts">
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { ref } from "vue"
import { useRouter } from "vue-router"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const { trigger } = useNotificationBar()
const authStore = useAuthStore()
const router = useRouter()

const dialogRef = ref<HTMLDialogElement | null>(null)
const loading = ref(false)

const submit = async () => {
  try {
    loading.value = true
    await authStore.deleteUser()
    trigger(`ユーザ情報を削除しました`, "success")
    dialogRef.value?.close()
    router.push("/login")
  } catch (err) {
    console.log(err)
    trigger(`ユーザ情報の削除に失敗しました。再度ログインした後に改めてお試しください`, "error")
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  if (loading.value) return
  dialogRef.value?.close()
}

function handleDeleteUser() {
  dialogRef.value?.showModal()
}
</script>

<template>
  <form @submit.prevent="handleDeleteUser">
    <button type="submit" class="warning-button">ユーザを削除する</button>
  </form>
  <dialog ref="dialogRef" @cancel="cancel">
    <form @submit.prevent="submit">
      <h2 class="title">ユーザアカウント削除の確認</h2>
      <div class="message">
        ふりかえり帖アプリからユーザ情報を削除しようとしています。この操作を行うと、これまでの記録に以後アクセスできなくなります。本当に削除してもよろしいですか？
      </div>
      <div class="actions">
        <button class="sub-button" type="button" @click="cancel">キャンセル</button>
        <button class="warning-button" type="submit">
          <LoadingSpinner v-if="loading" class="spinner" /> 削除する
        </button>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
dialog {
  border: none;
  border-radius: 8px;
  padding: 16px;
  max-width: 400px;
  width: 80%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--color-text);
}

.spinner {
  width: 16px;
  height: 16px;
  color: var(--color-warn-text);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}
</style>
