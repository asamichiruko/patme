<script setup>
import draggable from "vuedraggable"
import { nextTick, ref, watch } from "vue"
import TagOrderListItem from "@/components/tag/TagOrderListItem.vue"

const props = defineProps({
  initialTags: Array,
})

const emit = defineEmits(["update"])

const activeTagId = ref(null)
const currentTags = ref([...props.initialTags])

watch(
  () => currentTags.value,
  (val) => {
    emit("update", val)
  },
  { immediate: true },
)

watch(
  () => props.initialTags,
  (updated) => {
    currentTags.value = updated.toSorted((a, b) => a.order - b.order)
  },
  { immediate: true },
)

const resetOrder = () => {
  currentTags.value = props.initialTags.toSorted((a, b) => a.order - b.order)
}

const isActive = (tagId) => {
  return activeTagId?.value === tagId
}

const handleRequestActivate = (tagId) => {
  deactivate()
  activate(tagId)
}

const handleRequestDeactivate = () => {
  deactivate()
}

const handleRequestMoveItem = (tagId, dir) => {
  const index = currentTags.value.findIndex((t) => t.id === tagId)
  if (index != -1 && 0 <= index + dir && index + dir < currentTags.value.length) {
    moveTagItem(index, index + dir)
  }
}

const handleRequestMoveFocus = (tagId, dir) => {
  const index = currentTags.value.findIndex((t) => t.id === tagId)
  if (index != -1 && 0 <= index + dir && index + dir < currentTags.value.length) {
    moveFocus(index + dir)
  }
}

const activate = (tagId) => {
  activeTagId.value = tagId
}

const deactivate = () => {
  activeTagId.value = null
}

const moveFocus = (toIndex) => {
  if (toIndex < 0 || currentTags.value.length <= toIndex) {
    return
  }

  const tagId = currentTags.value[toIndex].id
  const el = document.querySelector(`.tag-list [tag-list-id="${tagId}"]`)
  const handle = el?.querySelector(`.drag-handle`)
  el?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  })
  handle?.focus()
}

const moveTagItem = (fromIndex, toIndex) => {
  if (fromIndex < 0 || currentTags.value.length <= fromIndex) {
    return
  }
  if (toIndex < 0 || currentTags.value.length <= toIndex) {
    return
  }

  const updated = [...currentTags.value]
  const [moved] = updated.splice(fromIndex, 1)
  updated.splice(toIndex, 0, moved)
  currentTags.value = updated

  nextTick(() => {
    moveFocus(toIndex)
  })
}

defineExpose({
  resetOrder,
})
</script>

<template>
  <draggable
    v-model="currentTags"
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
