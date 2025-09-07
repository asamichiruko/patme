<script setup lang="ts">
import { useDeleteCommentDialog } from "@/composables/useDeleteCommentDialog"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useCommentStore } from "@/stores/useCommentStore"
import { notify } from "@/utils/storageNotifier"
import { ref } from "vue"
import BaseDialog from "../util/BaseDialog.vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const { visible, params, closeDeleteCommentDialog } = useDeleteCommentDialog()
const { trigger } = useNotificationBar()
const commentStore = useCommentStore()

const loading = ref(false)

const submit = async () => {
  if (!params.value) return
  try {
    loading.value = true
    await commentStore.deleteComment(params.value.id)
    notify()
    trigger(`コメントを削除しました`, "success")
    closeDeleteCommentDialog()
  } catch (err) {
    console.log(err)
    trigger(`コメントの削除に失敗しました。時間をおいて再度お試しください`, "error")
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  if (loading.value) return
  closeDeleteCommentDialog()
}
</script>

<template>
  <BaseDialog :visible="visible" @submit="submit" @close="cancel">
    <template #title>
      <h2 class="title">コメントの削除の確認</h2>
    </template>
    <p>コメントを削除しようとしています。この操作は取り消せません。</p>
    <p>本当に削除してもよろしいですか？</p>
    <template #actions>
      <button class="sub-button" type="button" @click="cancel">キャンセル</button>
      <button class="warning-button" type="submit">
        <LoadingSpinner v-if="loading" class="spinner" />
        <span class="button-label">削除する</span>
      </button>
    </template>
  </BaseDialog>
</template>
