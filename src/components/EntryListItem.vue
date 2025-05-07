<script setup>
import starImg from "@/assets/star.svg"
import blankStarImg from "@/assets/blank-star.svg"
import { formatRelativeDate } from "@/utils/formatDate.js"

const props = defineProps({
  entry: Object,
})
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
</style>
