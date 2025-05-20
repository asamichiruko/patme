<script setup>
import { formatRelativeDate } from "@/utils/formatDate.js"

const props = defineProps({
  stars: Array,
})
</script>

<template>
  <template v-if="props.stars.length !== 0">
    <ul class="stars">
      <li class="star-comment" v-for="star in props.stars" :key="star.id">
        <span class="star-content">{{ star.content }}</span>
        <span class="star-date">{{ formatRelativeDate(star.date) }}</span>
      </li>
    </ul>
  </template>
</template>

<style scoped>
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
