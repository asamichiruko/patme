<script setup lang="ts">
import EntryList from "@/components/entry/EntryList.vue"
import TagSelector from "@/components/tag/TagSelector.vue"
import { useEntryStore } from "@/stores/useEntryStore"
import { useTagStore } from "@/stores/useTagStore"
import { computed, ref } from "vue"

const tagStore = useTagStore()
const selectedTagIds = ref<Set<string>>(new Set())
const entryStore = useEntryStore()

const filteredEntries = computed(() => {
  if (selectedTagIds.value.size === 0) {
    // タグが選択されていない場合はすべての記録を返す
    return entryStore.entriesWithRelations
  }

  return entryStore.entriesWithRelations
    .filter((entry) => entry.tagIds.some((tagId) => selectedTagIds.value.has(tagId)))
    .toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})
</script>

<template>
  <section>
    <h2>タグで絞り込み</h2>
    <TagSelector :tags="tagStore.tags" v-model="selectedTagIds" />
  </section>
  <section>
    <h2>記録の一覧</h2>
    <EntryList :entries="filteredEntries" />
  </section>
</template>

<style scoped>
.tag-list {
  margin: 0;
  padding: 16px 0;
  list-style-type: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px 8px;
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

section {
  margin-bottom: 24px;
}
h2 {
  padding-bottom: 8px;
}
</style>
