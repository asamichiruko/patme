<script setup lang="ts">
import type { Tag } from "@/schemas/Tag"

const props = defineProps<{
  tags: Tag[]
}>()
</script>

<template>
  <ul class="tags" v-if="props.tags.length !== 0">
    <li class="tag-label" v-for="tag in props.tags" :key="tag.id"># {{ tag.title }}</li>
  </ul>
</template>

<style scoped>
.tags {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
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
