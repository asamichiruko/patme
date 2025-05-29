<script setup>
import draggable from "vuedraggable"
import TagOrderListItem from "@/components/tag/TagOrderListItem.vue"
import { useTagOrderList } from "@/composables/useTagOrderList"

const tags = defineModel("tags", { required: true })

const getHandleElementById = (tagId) =>
  document.querySelector(`.tag-list [tag-list-id="${tagId}"] .drag-handle`)
const { isActive, handleKeydown } = useTagOrderList(tags, getHandleElementById)
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
          @keydown-on-handle="(e) => handleKeydown(e, element.id)"
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
