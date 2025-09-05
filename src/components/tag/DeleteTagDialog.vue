<script setup lang="ts">
import BaseDialog from "@/components/util/BaseDialog.vue"
import LoadingSpinner from "@/components/util/LoadingSpinner.vue"
import { useDeleteTagDialog } from "@/composables/useDeleteTagDialog"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useEntryStore } from "@/stores/useEntryStore"
import { useTagStore } from "@/stores/useTagStore"
import { notify } from "@/utils/storageNotifier"
import { ref, watch } from "vue"

const { visible, params, closeDeleteTagDialog } = useDeleteTagDialog()

const { trigger } = useNotificationBar()
const entryStore = useEntryStore()
const tagStore = useTagStore()

const taggingCount = ref(0)
const loading = ref(false)

watch(visible, async (val) => {
  if (val) {
    if (!params.value) return
    taggingCount.value = await entryStore.countEntriesWithTag(params.value.tagId)
  }
})

const submit = async () => {
  if (!params.value) return
  try {
    loading.value = true
    await tagStore.deleteTagAndDetachFromEntries(params.value.tagId)

    notify()
    trigger(`タグ「${params.value.tagTitle}」を削除しました`, "success")
    closeDeleteTagDialog()
  } catch (err) {
    console.log(err)
    trigger(`タグの削除に失敗しました。時間をおいて再度お試しください`, "error")
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  if (loading.value) return
  closeDeleteTagDialog()
}
</script>

<template>
  <BaseDialog :visible="visible" @submit="submit" @close="cancel">
    <template #title>
      <h2>タグの削除の確認</h2>
    </template>
    <p class="message">
      タグ「{{ params?.tagTitle }}」を削除しようとしています。<br />
      {{ taggingCount }} 件の記録からこのタグが取り除かれます。本当に削除してもよろしいですか？
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

<style scoped>
h2 {
  padding-bottom: 8px;
}
</style>
