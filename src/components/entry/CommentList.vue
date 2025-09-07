<script setup lang="ts">
import { useEditCommentDialog } from "@/composables/useEditCommentDialog"
import { type Option } from "@/composables/useOptionMenu"
import type { Comment } from "@/schemas/Comment"
import type { Entry } from "@/schemas/Entry"
import { formatRelativeDate } from "@/utils/formatDate.js"
import OptionMenuButton from "../util/OptionMenuButton.vue"

const props = defineProps<{
  entry: Entry
  comments: Comment[]
}>()

const { openEditCommentDialog } = useEditCommentDialog()

const reviewTypeLabels = {
  achievement: "よかったこと",
  incomplete: "ふりかえりたいこと",
  accepted: "受け入れたこと",
}

const menuOptions = [
  { value: "edit", label: "編集" },
  { value: "delete", label: "削除" },
]

const handleOptionSelect = (option: Option, params: Record<string, unknown>) => {
  const comment = params.comment as Comment
  if (option.value === "edit") {
    openEditCommentDialog({
      commentId: comment.id,
      entryId: props.entry.id,
      entryType: props.entry.entryType,
      oldContent: comment.content,
      oldReviewType: comment.reviewType,
    })
  }
}
</script>

<template>
  <template v-if="props.comments.length !== 0">
    <ul class="comments">
      <li
        :class="['comment-item', comment.reviewType]"
        v-for="comment in props.comments"
        :key="comment.id"
      >
        <div v-if="comment.reviewType" class="reviewed-message">
          {{ reviewTypeLabels[comment.reviewType] }} として再評価
        </div>
        <div class="comment-content">{{ comment.content }}</div>
        <div class="comment-footer">
          <OptionMenuButton
            :options="menuOptions"
            :handler="handleOptionSelect"
            :params="{ id: comment.id, comment: comment }"
          />
          <span class="comment-date">{{ formatRelativeDate(comment.createdAt) }}</span>
        </div>
      </li>
    </ul>
  </template>
</template>

<style scoped>
.comments {
  list-style-type: none;
  padding: 0;
  font-size: 16px;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reviewed-message {
  color: var(--color-subtext);
  font-size: 14px;
}

.comment-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: fit-content;
  padding: 16px;
  border: 1px solid var(--color-comment-border);
  border-radius: 15px 15px 15px 0;
  background-color: var(--color-comment-bg);
  color: var(--color-comment-text);
}
.comment-item.achievement {
  color: var(--color-comment-achievement-text);
  border-color: var(--color-comment-achievement-border);
  background-color: var(--color-comment-achievement-bg);
}
.comment-item.incomplete {
  color: var(--color-comment-incomplete-text);
  border-color: var(--color-comment-incomplete-border);
  background-color: var(--color-comment-incomplete-bg);
}
.comment-item.accepted {
  color: var(--color-comment-accepted-text);
  border-color: var(--color-comment-accepted-border);
  background-color: var(--color-comment-accepted-bg);
}

.comment-content {
  white-space: pre-wrap;
}

.comment-footer {
  display: flex;
  gap: 8px;
  align-items: center;
}

.option-menu-button {
  display: inline-block;
  width: 16px;
  height: 16px;
  color: var(--color-subtext);
  margin-left: auto;
}

.comment-date {
  display: inline-block;
  color: var(--color-subtext);
  font-size: 14px;
}
</style>
