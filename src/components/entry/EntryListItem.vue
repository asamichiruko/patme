<script setup lang="ts">
import commentImg from "@/assets/comment.svg"
import tagImg from "@/assets/tag.svg"

import TagPillList from "@/components/tag/TagPillList.vue"
import CommentList from "./CommentList.vue"

import { useAddCommentDialog } from "@/composables/useAddCommentDialog"
import { useTaggingDialog } from "@/composables/useTaggingDialog"
import type { EntryWithRelations } from "@/schemas/EntryWithRelations"
import { formatRelativeDate } from "@/utils/formatDate"

const { openTaggingDialog } = useTaggingDialog()
const { openAddComment } = useAddCommentDialog()

const props = defineProps<{
  entry: EntryWithRelations
}>()

const handleAddComment = async () => {
  await openAddComment(props.entry.id, props.entry.entryType)
}

const handleUpdateTagging = async () => {
  await openTaggingDialog(props.entry.id, props.entry.tagIds)
}

const entryTypeLabel = {
  achievement: "よかったこと",
  incomplete: "ふりかえりたいこと",
  accepted: "受け入れたこと",
}
</script>

<template>
  <div class="entry-container" :class="props.entry.entryType">
    <div class="achievement-header">
      <div class="entry-type-label">
        <span class="entry-type">{{ entryTypeLabel[props.entry.entryType] }}</span>
        <small v-if="props.entry.isReviewed">（再評価済み）</small>
      </div>
      <div class="achievement-date">{{ formatRelativeDate(props.entry.createdAt) }}</div>
    </div>

    <div class="achievement-content">
      {{ props.entry.content }}
    </div>

    <TagPillList :tags="props.entry.tags" />
    <CommentList :comments="props.entry.comments" />

    <div class="entry-actions">
      <button class="action-button" @click="handleAddComment">
        <img :src="commentImg" alt="" class="action-icon" width="20px" height="20px" />
        <span class="action-text">コメント</span>
      </button>
      <button class="action-button" @click="handleUpdateTagging">
        <img :src="tagImg" alt="" class="action-icon" width="20px" height="20px" />
        <span class="action-text">タグ</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.entry-container {
  background-color: var(--color-entry-bg);
  border: 2px solid var(--color-entry-border);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 4px;
}
.entry-container.achievement {
  border-color: var(--color-entry-type-achievement-border);
}
.entry-container.incomplete {
  border-color: var(--color-entry-type-incomplete-border);
}
.entry-container.accepted {
  border-color: var(--color-entry-type-accepted-border);
}

.achievement-header {
  display: flex;
}
.achievement-date {
  color: var(--color-subtext);
  font-size: 15px;
  margin-left: auto;
  white-space: nowrap;
}

.entry-container.achievement .entry-type-label {
  color: var(--color-entry-type-achievement-text);
}
.entry-container.incomplete .entry-type-label {
  color: var(--color-entry-type-incomplete-text);
}
.entry-container.accepted .entry-type-label {
  color: var(--color-entry-type-accepted-text);
}
.entry-type-label {
  display: flex;
  flex-wrap: wrap;
}
.entry-container .entry-type-label .entry-type {
  display: inline-block;
}
.entry-container .entry-type-label small {
  font-size: 14px;
  color: var(--color-subtext);
  display: inline-block;
}

.achievement-content {
  font-size: 20px;
  white-space: pre-wrap;
  margin: 32px 0;
  padding: 0 32px;
}

.entry-actions {
  margin-top: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
}
.action-button {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
  font-size: 14px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}
.action-button:hover {
  background-color: var(--color-primary-hover);
}
.action-button:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
  border-radius: 4px;
}
.action-icon {
  width: 18px;
  height: 18px;
  padding-right: 4px;
  display: inline-block;
}
.action-text {
  display: inline-block;
}
</style>
