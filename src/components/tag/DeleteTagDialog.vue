<script setup lang="ts">
import { useDeleteTagDialog } from "@/composables/useDeleteTagDialog"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useEntryStore } from "@/stores/useEntryStore"
import { useTagStore } from "@/stores/useTagStore"
import { notify } from "@/utils/storageNotifier"
import { ref, watch } from "vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const { visible, params, closeDeleteTagDialog } = useDeleteTagDialog()

const { trigger } = useNotificationBar()
const entryStore = useEntryStore()
const tagStore = useTagStore()

const dialogRef = ref<HTMLDialogElement | null>(null)
const taggingCount = ref(0)
const loading = ref(false)

watch(visible, async (val) => {
  if (val) {
    if (!params.value) return
    taggingCount.value = await entryStore.countEntriesWithTag(params.value.tagId)

    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
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
  <Teleport to="body">
    <dialog ref="dialogRef" @cancel="cancel">
      <form @submit.prevent="submit">
        <h2 class="title">タグの削除の確認</h2>
        <div class="message">
          タグ「{{ params?.tagTitle }}」を削除しようとしています。
          {{ taggingCount }} 件の記録からこのタグが取り除かれます。本当に削除してもよろしいですか？
        </div>
        <div class="actions">
          <button class="sub-button" type="button" @click="cancel">キャンセル</button>
          <button class="warning-button" type="submit">
            <LoadingSpinner v-if="loading" class="spinner" />
            <span class="button-label">削除する</span>
          </button>
        </div>
      </form>
    </dialog>
  </Teleport>
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

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}
</style>
