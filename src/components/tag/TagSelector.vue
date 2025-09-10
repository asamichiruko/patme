<script setup lang="ts">
import type { Tag } from "@/schemas/Tag"
import { computed } from "vue"

const props = defineProps<{
  tags: Tag[]
  modelValue: Set<string>
}>()
const emit = defineEmits(["update:modelValue"])

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
})

const toggleSelectedState = (id: string) => {
  if (localValue.value.has(id)) {
    localValue.value.delete(id)
  } else {
    localValue.value.add(id)
  }
}
</script>

<template>
  <p class="empty-state" v-if="props.tags.length === 0">タグがありません</p>
  <ul class="tag-list" v-else>
    <li v-for="tag in props.tags" :key="tag.id">
      <button
        :class="['tag', { selected: localValue.has(tag.id) }]"
        :aria-pressed="localValue.has(tag.id)"
        type="button"
        @click="toggleSelectedState(tag.id)"
        :tag-id="tag.id"
      >
        {{ tag.title }}
      </button>
    </li>
  </ul>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 16px 0;
  color: var(--color-subtext);
}

.tag-list {
  list-style-type: none;
  padding: 16px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px 8px;
  max-height: 200px;
  overflow-y: scroll;
}

.tag {
  display: inline-block;
  color: var(--color-tag-text);
  background-color: var(--color-tag);
  border: 1px dashed var(--color-tag-border);
  padding: 4px 16px;
  font-size: 14px;
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
}
.tag.selected {
  color: var(--color-tag-text);
  background-color: var(--color-tag-selected);
  border: 1px solid var(--color-tag-border);
}
.tag:focus-visible {
  outline: 1px solid var(--color-tag-focus);
  outline-offset: 1px;
}
.tag:hover {
  background-color: var(--color-tag-hover);
}
.tag.selected:hover {
  background-color: var(--color-tag-selected-hover);
}
</style>
