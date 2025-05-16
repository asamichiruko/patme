<script setup>
import handleImg from "@/assets/handle.svg"

const props = defineProps({
  tag: Object,
  isActive: Boolean,
})

const emit = defineEmits([
  "request-activate",
  "request-deactivate",
  "request-move-item",
  "request-move-focus",
])

const handleKeydown = (event) => {
  if (event.key === "Escape" || event.key === "Tab") {
    emit("request-deactivate", props.tag.id)
    return
  }

  if (event.key === "Enter" || event.key === " ") {
    if (props.isActive) {
      emit("request-deactivate")
    } else {
      emit("request-activate", props.tag.id)
    }
    event.preventDefault()
    return
  }

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    const dir = event.key === "ArrowUp" ? -1 : 1
    if (props.isActive) {
      emit("request-move-item", props.tag.id, dir)
    } else {
      emit("request-move-focus", props.tag.id, dir)
    }
    event.preventDefault()
    return
  }
}
</script>

<template>
  <div class="tag-list-item" :class="{ active: props.isActive }">
    <button
      type="button"
      class="drag-handle"
      @keydown="handleKeydown"
      aria-label="並び替えハンドル"
    >
      <img
        :src="handleImg"
        alt=""
        width="20px"
        height="20px"
        :aria-pressed="props.isActive ? 'true' : 'false'"
      />
    </button>
    <span class="tag-title">{{ props.tag.title }}</span>
  </div>
</template>

<style scoped>
.tag-list-item {
  background-color: var(--color-tag-list-bg);
  color: var(--color-tag-list-text);
  border-bottom: 1px solid var(--color-tag-list-border);
  padding: 8px 0;
  display: flex;
  gap: 16px;
  align-items: center;
}
.tag-list-item.active {
  background-color: var(--color-tag-list-focus);
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
.ghost {
  background-color: var(--color-tag-list-focus);
}

.tag-title {
  display: inline-block;
  color: var(--color-tag-list-text);
  height: 24px;
}
</style>
