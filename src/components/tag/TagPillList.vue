<script setup lang="ts">
import type { Tag } from "@/schemas/Tag"
import { computed } from "vue"

const props = defineProps<{
  tags: Tag[]
}>()

const sortedTags = computed(() => {
  return props.tags.toSorted((a, b) => a.sortOrder - b.sortOrder)
})
</script>

<template>
  <ul class="tags" v-if="props.tags.length !== 0">
    <li class="tag-label" v-for="tag in sortedTags" :key="tag.id"># {{ tag.title }}</li>
  </ul>
</template>

<style scoped>
.tags {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 24px;
}
.tag-label {
  color: var(--color-tag-text);
  background-color: var(--color-tag-selected);
  padding: 4px 16px;
  font-size: 14px;
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
}
</style>
