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
        <div class="star-content">{{ star.content }}</div>
        <div class="star-date">{{ formatRelativeDate(star.date) }}</div>
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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.star-comment {
  display: block;
  width: fit-content;
  padding: 16px;
  border: 1px solid hsl(150, 50%, 40%);
  border-radius: 15px 15px 15px 0;
  background-color: #ffffff;
  color: var(--color-text);
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
