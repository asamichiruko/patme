<script setup lang="ts">
import { useDeleteUserDialog } from "@/composables/useDeleteUserDialog"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useAuthStore } from "@/stores/useAuthStore"
import { ref } from "vue"
import { useRouter } from "vue-router"
import BaseDialog from "../util/BaseDialog.vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const { visible, closeDeleteUserDialog } = useDeleteUserDialog()
const { trigger } = useNotificationBar()
const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)

const submit = async () => {
  try {
    loading.value = true
    await authStore.deleteUser()
    trigger(`ユーザ情報を削除しました`, "success")
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
  closeDeleteUserDialog()
}
</script>

<template>
  <BaseDialog :visible="visible" @submit="submit" @close="cancel">
    <template #title>
      <h2 class="title">ユーザアカウント削除の確認</h2>
    </template>
    <p>ふりかえり帖アプリからユーザ情報を削除しようとしています。</p>
    <p>
      この操作を行うと、これまでの記録に以後アクセスできなくなります。本当に削除してもよろしいですか？
    </p>
    <template #actions>
      <button class="sub-button" type="button" @click="cancel">キャンセル</button>
      <button class="warning-button" type="submit">
        <LoadingSpinner v-if="loading" class="spinner" />
        <span class="button-label">削除する</span>
      </button>
    </template>
  </BaseDialog>
</template>
