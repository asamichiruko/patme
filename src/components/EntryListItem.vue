<script setup>
import { formatRelativeDate } from "@/utils/formatDate.js"
import starImg from "@/assets/star.svg"
import blankStarImg from "@/assets/blank-star.svg"
import commentImg from "@/assets/comment.svg"
import tagImg from "@/assets/tag.svg"

const props = defineProps({
  entry: Object,
})

const emit = defineEmits(["comment", "tagging"])
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
    <ul class="tags">
      <li class="tag selected" v-for="tag in props.entry.tags" :key="tag.id">{{ tag.title }}</li>
    </ul>
    <template v-if="props.entry.stars.length !== 0">
      <ul class="stars">
        <li class="star-comment" v-for="star in props.entry.stars" :key="star.id">
          <span class="star-content">{{ star.content }}</span>
          <span class="star-date">{{ formatRelativeDate(star.date) }}</span>
        </li>
      </ul>
    </template>
    <div class="entry-actions">
      <button class="comment-button" @click="emit('comment', entry)">
        <img :src="commentImg" alt="" class="comment-icon" width="20px" height="20px" />
        <span class="comment-text">コメント</span>
      </button>
      <button class="tag-edit-button" @click="emit('tagging', entry)">
        <img :src="tagImg" alt="" class="tag-icon" width="20px" height="20px" />
        <span class="tag-text">タグ</span>
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

.tags {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.stars {
  list-style-type: none;
  padding: 0;
  font-size: 15px;
  color: var(--color-text);
}
.star-comment {
  margin: 16px 0;
}
.star-content {
  white-space: pre-wrap;
}
.star-date {
  color: var(--color-subtext);
  margin-left: 16px;
  font-size: 14px;
}

.entry-actions {
  margin-top: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.comment-button {
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
.comment-button:hover {
  background-color: var(--color-primary-hover);
}
.comment-button:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
  border-radius: 4px;
}
.comment-icon {
  width: 18px;
  height: 18px;
  padding-right: 4px;
  display: inline-block;
}
.comment-text {
  display: inline-block;
}

.tag-edit-button {
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
.tag-edit-button:hover {
  background-color: var(--color-primary-hover);
}
.tag-edit-button:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
  border-radius: 4px;
}
.tag-icon {
  width: 18px;
  height: 18px;
  padding-right: 4px;
  display: inline-block;
}
.tag-text {
  display: inline-block;
}
</style>
