<script setup lang="ts">
import { useDeleteEntryDialog } from "@/composables/useDeleteEntryDialog"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useEntryStore } from "@/stores/useEntryStore"
import { ref } from "vue"
import BaseDialog from "../util/BaseDialog.vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const { visible, params, closeDeleteEntryDialog } = useDeleteEntryDialog()
const { trigger } = useNotificationBar()
const entryStore = useEntryStore()

const loading = ref(false)

const submit = async () => {
  if (!params.value) return
  try {
    loading.value = true
    await entryStore.deleteEntry(params.value.id)
    trigger(`記録を削除しました`, "success")
    closeDeleteEntryDialog()
  } catch (err) {
    console.log(err)
    trigger(`記録の削除に失敗しました。時間をおいて再度お試しください`, "error")
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  if (loading.value) return
  closeDeleteEntryDialog()
}
</script>

<template>
  <BaseDialog :visible="visible" @submit="submit" @close="cancel">
    <template #title>
      <h2 class="title">記録の削除の確認</h2>
    </template>
    <p>記録を削除しようとしています。この操作は取り消せません。</p>
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
