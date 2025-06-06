<script setup>
import starImg from "@/assets/star.svg"
import blankStarImg from "@/assets/blank-star.svg"
import commentImg from "@/assets/comment.svg"
import tagImg from "@/assets/tag.svg"

import TagPillList from "@/components/tag/TagPillList.vue"
import StarList from "@/components/entry/StarList.vue"

import { formatRelativeDate } from "@/utils/formatDate.js"
import { useDialogStore } from "@/composables/useDialogStore.js"
import { usePromptDialog } from "@/composables/usePromptDialog.js"
import { useNotificationBar } from "@/composables/useNotificationBar.js"
import { useEntryStore } from "@/stores/useEntryStore.js"
import { useTaggingStore } from "@/stores/useTaggingStore.js"

const { trigger } = useNotificationBar()
const { open } = useDialogStore()
const { openPrompt } = usePromptDialog()
const entryStore = useEntryStore()
const taggingStore = useTaggingStore()

const props = defineProps({
  entry: Object,
})

const handleAddComment = async () => {
  const content = await openPrompt({
    defaultValue: "",
  })

  if (!content) {
    return
  }

  const result = entryStore.addStar({
    achievementId: props.entry.id,
    content,
    date: new Date(),
  })

  if (result) {
    trigger("コメントを記録しました！", "success")
  } else {
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  }
}

const handleUpdateTagging = async () => {
  const tagIds = await open("tagging", {
    initialTagIds: props.entry.tags.map((t) => t.id),
  })

  if (!tagIds) {
    return
  }

  taggingStore.updateTaggings({ achievementId: props.entry.id, tagIds })
}
</script>

<template>
  <div class="entry-container">
    <div class="achievement-header">
      <div class="star-count">
        <template v-if="props.entry.stars.length === 0">
          <img :src="blankStarImg" alt="" class="star-icon" width="20px" height="20px" />
        </template>
        <template v-else>
          <img :src="starImg" alt="star" class="star-icon" width="20px" height="20px" />
          <span class="star-count-text">{{ props.entry.stars.length }}</span>
        </template>
      </div>
      <div class="achievement-date">{{ formatRelativeDate(props.entry.date) }}</div>
    </div>

    <div class="achievement-content">
      {{ props.entry.content }}
    </div>

    <TagPillList :tags="props.entry.tags" />
    <StarList :stars="props.entry.stars" />

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
.achievement-header {
  display: flex;
}
.achievement-date {
  color: var(--color-subtext);
  font-size: 15px;
  margin-left: auto;
}
.star-count {
  font-family: "Franklin Gothic", "Arial Bold", Arial, sans-serif;
  color: var(--color-primary);
  font-size: 20px;
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
  gap: 8px;
}
.star-icon {
  width: 20px;
  height: 20px;
  padding-bottom: 0.1em;
  display: inline-block;
}
.star-count-text {
  font-weight: bold;
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
