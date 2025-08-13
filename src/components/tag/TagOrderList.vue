<script setup lang="ts">
import TagOrderListItem from "@/components/tag/TagOrderListItem.vue"
import { useTagOrderList } from "@/composables/useTagOrderList"
import type { Tag } from "@/schemas/Tag"
import draggable from "vuedraggable"

const tags = defineModel<Tag[]>("tags", { required: true })

const getHandleElementById = (tagId: string) =>
  document.querySelector(`.tag-list [tag-list-id="${tagId}"] .drag-handle`)
const { isActive, handleKeydown } = useTagOrderList(tags, getHandleElementById)

const scrollToTag = (tagId: string) => {
  const handle = getHandleElementById(tagId)
  handle?.scrollIntoView({ behavior: "smooth", block: "nearest" })
}

defineExpose({ scrollToTag })
</script>

<template>
  <draggable
    v-model="tags"
    item-key="id"
    handle=".drag-handle"
    tag="ul"
    animation="200"
    ghost-class="ghost"
    class="tag-list"
  >
    <template #item="{ element }">
      <li :tag-list-id="element.id">
        <TagOrderListItem
          :tag="element"
          :is-active="isActive(element.id)"
          @keydown-on-handle="(e: KeyboardEvent) => handleKeydown(e, element.id)"
        />
      </li>
    </template>
  </draggable>
</template>

<style scoped>
.tag-list {
  background-color: var(--color-tag-list-bg);
  list-style-type: none;
  padding: 16px;

  max-height: 400px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  border: 1px solid var(--color-tag-list-border);
  border-radius: 8px;
}
</style>
