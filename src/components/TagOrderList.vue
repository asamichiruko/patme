<script setup>
import draggable from "vuedraggable"
import handleImg from "@/assets/handle.svg"
import { nextTick, ref, watch } from "vue"

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

const handleKeydown = (tagId, event) => {
  if (activeTagId.value !== null && activeTagId.value !== tagId) {
    deactivate()
  }

  if (activeTagId.value === null) {
    handleKeydownWhenInactive(tagId, event)
  } else {
    handleKeydownWhenActive(tagId, event)
  }
}

const handleKeydownWhenInactive = (tagId, event) => {
  const isConfirmKey = event.key === "Enter" || event.key === " "
  const isMoveUpKey = event.key === "ArrowUp"
  const isMoveDownKey = event.key === "ArrowDown"

  if (isConfirmKey) {
    deactivate()
    if (activeTagId.value !== tagId) {
      activate(tagId)
    }
    event.preventDefault()
    return
  }

  const index = currentTags.value.findIndex((t) => t.id === tagId)
  if (isMoveUpKey && index - 1 >= 0) {
    moveFocus(index - 1)
    event.preventDefault()
  } else if (isMoveDownKey && index + 1 < currentTags.value.length) {
    moveFocus(index + 1)
    event.preventDefault()
  }
}

const handleKeydownWhenActive = (tagId, event) => {
  const isConfirmKey = event.key === "Enter" || event.key === " "
  const isCancelKey = event.key === "Escape" || event.key === "Tab"
  const isMoveUpKey = event.key === "ArrowUp"
  const isMoveDownKey = event.key === "ArrowDown"

  if (isConfirmKey) {
    deactivate()
    event.preventDefault()
    return
  } else if (isCancelKey) {
    deactivate()
    return
  }

  const index = currentTags.value.findIndex((t) => t.id === tagId)
  if (isMoveUpKey && index - 1 >= 0) {
    moveTagItem(index, index - 1)
    event.preventDefault()
  } else if (isMoveDownKey && index + 1 < currentTags.value.length) {
    moveTagItem(index, index + 1)
    event.preventDefault()
  }
}

const activate = (tagId) => {
  activeTagId.value = tagId
  const el = document.querySelector(`.tag-manager [tag-list-id="${tagId}"]`)
  el?.classList.add("active")
  const handle = el?.querySelector(`.drag-handle`)
  handle.setAttribute("aria-pressed", "true")
}

const deactivate = () => {
  activeTagId.value = null
  const activeItems = document.querySelectorAll(`.tag-manager .active`)
  activeItems.forEach((el) => {
    el?.classList.remove("active")
    const handle = el?.querySelector(`.drag-handle`)
    handle?.setAttribute("aria-pressed", "false")
  })
}

const moveFocus = (toIndex) => {
  if (toIndex < 0 || currentTags.value.length <= toIndex) {
    return
  }

  const tagId = currentTags.value[toIndex].id
  const el = document.querySelector(`.tag-manager .tag-list-item[tag-list-id="${tagId}"]`)
  const handle = el?.querySelector(`.drag-handle`)
  handle?.focus()
  el?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  })
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
      <li class="tag-list-item" :tag-list-id="element.id">
        <button
          type="button"
          class="drag-handle"
          @keydown="handleKeydown(element.id, $event)"
          aria-label="並び替えハンドル"
        >
          <img
            :src="handleImg"
            alt=""
            width="20px"
            height="20px"
            :aria-pressed="element.id === activeTagId ? 'true' : 'false'"
          />
        </button>
        <span class="tag-title">{{ element.title }}</span>
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
.tag-list-item {
  background-color: var(--color-tag-list-bg);
  color: var(--color-tag-list-text);
  border-bottom: 1px solid var(--color-tag-list-border);
  padding: 8px 0;
  display: flex;
  gap: 16px;
  align-items: center;
}

.drag-handle {
  width: 20px;
  height: 20px;
  display: inline-block;
}
.drag-handle:focus-visible {
  outline: 2px solid var(--color-tag-list-border);
  outline-offset: 2px;
  border-radius: 4px;
}
.tag-title {
  display: inline-block;
  color: var(--color-tag-list-text);
  height: 24px;
}
.ghost {
  background-color: var(--color-tag-list-focus);
}
.tag-list-item.active {
  background-color: var(--color-tag-list-focus);
}
</style>
