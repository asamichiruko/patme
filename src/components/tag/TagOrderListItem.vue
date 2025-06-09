<script setup>
import handleImg from "@/assets/handle.svg"
import trashImg from "@/assets/trash.svg"

const props = defineProps({
  tag: Object,
  isActive: Boolean,
})

const emit = defineEmits(["keydown-on-handle"])

const handlePressDelete = () => {
  console.log(props.tag.id)
}
</script>

<template>
  <div class="tag-list-item" :class="{ active: props.isActive }">
    <button
      type="button"
      class="drag-handle"
      @keydown="(e) => emit('keydown-on-handle', e)"
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
    <button type="button" class="delete-button" @click="handlePressDelete">
      <img :src="trashImg" alt="削除" width="20px" height="20px" />
    </button>
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

.delete-button {
  margin-left: auto;
  width: 20px;
  height: 20px;
  display: inline-block;
}
.delete-button:focus-visible {
  outline: 2px solid var(--color-error);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
