<script setup lang="ts">
import commentImg from "@/assets/comment.svg"
import tagImg from "@/assets/tag.svg"

import TagPillList from "@/components/tag/TagPillList.vue"
import CommentList from "./CommentList.vue"

import { useCommentFormDialog } from "@/composables/useCommentFormDialog"
import { useDeleteEntryDialog } from "@/composables/useDeleteEntryDialog"
import { useEntryFormDialog } from "@/composables/useEntryFormDialog"
import type { Option } from "@/composables/useOptionMenu"
import { useTaggingDialog } from "@/composables/useTaggingDialog"
import type { EntryWithRelations } from "@/schemas/EntryWithRelations"
import { formatRelativeDate } from "@/utils/formatDate"
import OptionMenuButton from "../util/OptionMenuButton.vue"

const { openTaggingDialog } = useTaggingDialog()
const { openCommentFormDialog } = useCommentFormDialog()
const { openEntryFormDialog } = useEntryFormDialog()
const { openDeleteEntryDialog } = useDeleteEntryDialog()

const props = defineProps<{
  entry: EntryWithRelations
}>()

const handleAddComment = async () => {
  openCommentFormDialog({
    action: "create",
    entryId: props.entry.id,
    entryType: props.entry.entryType,
  })
}

const handleUpdateTagging = async () => {
  openTaggingDialog({ entryId: props.entry.id, tagIds: props.entry.tagIds })
}

const entryTypeLabel = {
  achievement: "嬉しい",
  incomplete: "モヤモヤ",
  accepted: "気づき",
}

const menuOptions = [
  { value: "edit", label: "編集" },
  { value: "delete", label: "削除" },
]

const handleOptionSelect = (option: Option) => {
  if (option.value === "edit") {
    openEntryFormDialog({
      action: "update",
      entryId: props.entry.id,
      initialEntryType: props.entry.entryType,
      initialContent: props.entry.content,
      initialReviewedCount: props.entry.reviewedCount,
      initialTagIds: props.entry.tagIds,
    })
  } else if (option.value === "delete") {
    openDeleteEntryDialog({ id: props.entry.id })
  }
}
</script>

<template>
  <div class="entry-container" :class="props.entry.entryType">
    <div class="achievement-header">
      <div class="entry-type-label">
        <span class="entry-type">{{ entryTypeLabel[props.entry.entryType] }}</span>
        <small v-if="props.entry.reviewedCount > 0">（再評価済み）</small>
      </div>
      <OptionMenuButton
        class="option-menu-button"
        :options="menuOptions"
        :handler="handleOptionSelect"
        :params="{}"
      />
      <div class="achievement-date">{{ formatRelativeDate(props.entry.createdAt) }}</div>
    </div>

    <div class="achievement-content">
      {{ props.entry.content }}
    </div>

    <TagPillList :tags="props.entry.tags" />
    <CommentList :entry="props.entry" :comments="props.entry.comments" />

    <div class="entry-actions">
      <button class="primary-button" type="button" @click="handleAddComment">
        <img :src="commentImg" alt="" class="action-icon" width="20px" height="20px" />
        <span class="button-label">コメント</span>
      </button>
      <button class="primary-button" type="button" @click="handleUpdateTagging">
        <img :src="tagImg" alt="" class="action-icon" width="20px" height="20px" />
        <span class="button-label">タグ</span>
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
.achievement-date {
  color: var(--color-subtext);
  font-size: 15px;
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

.action-icon {
  width: 18px;
  height: 18px;
  display: inline-block;
}
</style>
