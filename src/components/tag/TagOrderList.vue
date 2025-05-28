<script setup>
import draggable from "vuedraggable"
import { nextTick, ref } from "vue"
import TagOrderListItem from "@/components/tag/TagOrderListItem.vue"

const tags = defineModel("tags", { required: true })
const activeTagId = ref(null)

const isActive = (tagId) => {
  return activeTagId?.value === tagId
}

const isValidIndex = (index) => {
  return 0 <= index && index < tags.value.length
}

const handleRequestActivate = (tagId) => {
  activeTagId.value = tagId
}

const handleRequestDeactivate = () => {
  activeTagId.value = null
}

const handleRequestMoveItem = (tagId, dir) => {
  const index = tags.value.findIndex((t) => t.id === tagId)
  if (index != -1 && isValidIndex(index + dir)) {
    moveTagItem(index, index + dir)
  }
  // 全体が update されて focus が外れるので付け直す
  nextTick(() => {
    moveFocus(index + dir)
  })
}

const handleRequestMoveFocus = (tagId, dir) => {
  const index = tags.value.findIndex((t) => t.id === tagId)
  if (index != -1 && isValidIndex(index + dir)) {
    moveFocus(index + dir)
  }
}

const moveFocus = (toIndex) => {
  if (!isValidIndex(toIndex)) {
    return
  }

  const tagId = tags.value[toIndex].id
  const el = document.querySelector(`.tag-list [tag-list-id="${tagId}"]`)
  const handle = el?.querySelector(`.drag-handle`)
  el?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  })
  handle?.focus()
}

const moveTagItem = (fromIndex, toIndex) => {
  if (!isValidIndex(fromIndex) || !isValidIndex(toIndex)) {
    return
  }

  const updated = [...tags.value]
  const [moved] = updated.splice(fromIndex, 1)
  updated.splice(toIndex, 0, moved)
  tags.value = updated
}
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
          @request-activate="handleRequestActivate"
          @request-deactivate="handleRequestDeactivate"
          @request-move-item="handleRequestMoveItem"
          @request-move-focus="handleRequestMoveFocus"
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
