<script setup lang="ts">
import { useCommentFormDialog } from "@/composables/useCommentFormDialog"
import { useNotificationBar } from "@/composables/useNotificationBar"
import type { Comment } from "@/schemas/Comment"
import type { EntryType } from "@/schemas/EntryType"
import { useCommentStore } from "@/stores/useCommentStore"
import { notify } from "@/utils/storageNotifier"
import { ref, watch } from "vue"
import BaseDialog from "../util/BaseDialog.vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"
import EntryTypeSelector from "./EntryTypeSelector.vue"

const { visible, params, closeCommentFormDialog } = useCommentFormDialog()
const commentStore = useCommentStore()
const { trigger } = useNotificationBar()

const content = ref("")
const showReviewType = ref(false)
const selectedReviewType = ref<EntryType>("achievement")
const loading = ref(false)

watch(visible, (val) => {
  if (val) {
    content.value = params.value?.initialContent ?? ""
    if (params.value?.initialReviewType) {
      showReviewType.value = true
      selectedReviewType.value = params.value.initialReviewType
    } else {
      showReviewType.value = false
    }
  }
})

const closeDialog = () => {
  content.value = ""
  showReviewType.value = false
  selectedReviewType.value = "achievement"
  closeCommentFormDialog()
}

const submit = async () => {
  if (!params.value) return

  const commentBody: Omit<Comment, "id" | "entryId" | "createdAt"> | null = {
    content: content.value,
    reviewType: showReviewType.value ? selectedReviewType.value : null,
  }

  loading.value = true
  try {
    if (params.value.action === "create") {
      await commentStore.addComment(params.value.entryId, commentBody)
    } else if (params.value.action === "update" && params.value.commentId) {
      await commentStore.updateComment(params.value.commentId, params.value.entryId, commentBody)
    } else {
      throw new Error("Invalid comment action")
    }
    notify()
    closeDialog()
  } catch (err) {
    console.error(err)
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  if (loading.value) return
  closeDialog()
}
</script>

<template>
  <BaseDialog :visible="visible" @submit="submit" @close="cancel">
    <template #title>
      <h2>ふりかえりコメント</h2>
    </template>
    <div class="comment-container">
      <label>
        <div class="label-header">コメント内容</div>
        <textarea
          v-model="content"
          @keydown.ctrl.enter="submit"
          placeholder="この記録について、現在はどう感じますか？"
          class="content"
          required
        ></textarea>
      </label>
      <label>
        <input type="checkbox" v-model="showReviewType" />
        コメントに分類をつける
      </label>
      <fieldset v-if="showReviewType">
        <legend class="label-header">コメントの分類</legend>
        <EntryTypeSelector v-model="selectedReviewType" :show-hint="false" />
      </fieldset>
    </div>
    <template #actions>
      <button class="sub-button" type="button" @click="cancel">キャンセル</button>
      <button class="primary-button" type="submit">
        <LoadingSpinner v-if="loading" class="spinner" />
        <span class="button-label">記録する</span>
      </button>
    </template>
  </BaseDialog>
</template>

<style scoped>
legend {
  margin: 0;
  padding: 0;
  width: 100%;
}
fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
}

h2 {
  padding-bottom: 8px;
}

.label-header {
  margin-bottom: 8px;
}

.comment-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.content {
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 16px;
  display: block;
  width: -webkit-fill-available;
  width: -moz-available;
  width: stretch;
  height: 60px;
  line-height: 1.6;
}
</style>
