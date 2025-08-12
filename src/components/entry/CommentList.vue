<script setup lang="ts">
import type { Comment } from "@/schemas/Comment"
import { formatRelativeDate } from "@/utils/formatDate.js"

const props = defineProps<{
  comments: Comment[]
}>()

const reviewTypeLabels = {
  achievement: "よかったこと",
  incomplete: "ふりかえりたいこと",
  accepted: "受け入れたこと",
}
</script>

<template>
  <template v-if="props.comments.length !== 0">
    <ul class="stars">
      <li
        :class="['star-comment', comment.reviewType]"
        v-for="comment in props.comments"
        :key="comment.id"
      >
        <div v-if="comment.reviewType" class="reviewed-message">
          {{ reviewTypeLabels[comment.reviewType] }} として再評価
        </div>
        <div class="star-content">{{ comment.content }}</div>
        <div class="star-date">{{ formatRelativeDate(comment.createdAt) }}</div>
      </li>
    </ul>
  </template>
</template>

<style scoped>
.stars {
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

.star-comment {
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
.star-comment.achievement {
  color: var(--color-comment-achievement-text);
  border-color: var(--color-comment-achievement-border);
  background-color: var(--color-comment-achievement-bg);
}
.star-comment.incomplete {
  color: var(--color-comment-incomplete-text);
  border-color: var(--color-comment-incomplete-border);
  background-color: var(--color-comment-incomplete-bg);
}
.star-comment.accepted {
  color: var(--color-comment-accepted-text);
  border-color: var(--color-comment-accepted-border);
  background-color: var(--color-comment-accepted-bg);
}

.star-content {
  white-space: pre-wrap;
}
.star-date {
  text-align: right;
  color: var(--color-subtext);
  font-size: 14px;
}
</style>
