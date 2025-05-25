<script setup>
import { ref } from "vue"
import { useTagStore } from "@/stores/useTagStore.js"

const emit = defineEmits(["tag-created"])
const newTagTitle = ref("")
const tagStore = useTagStore()

const handleCreateTag = () => {
  const trimmed = newTagTitle.value.trim()
  if (!trimmed) {
    return
  }

  let result = tagStore.addTag(trimmed)
  newTagTitle.value = ""
  if (!result) {
    result = tagStore.findByTitle(trimmed)
  }
  emit("tag-created", result)
}
</script>

<template>
  <div class="tag-create-form">
    <label>
      <span class="new-tag-label">タグを追加</span>
      <input
        class="new-tag-title"
        type="text"
        v-model="newTagTitle"
        @keydown.enter.prevent="handleCreateTag"
        placeholder="新しいタグ名"
      />
    </label>
    <button class="tag-create-button" type="button" @click="handleCreateTag">追加</button>
  </div>
</template>

<style scoped>
.new-tag-label {
  font-size: 15px;
}
.new-tag-title {
  padding: 8px;
  font-size: 15px;
  margin: 0 8px;
  width: 100px;
}
.tag-create-button {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
  border: none;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.tag-create-button:hover {
  background-color: var(--color-primary-hover);
}
.tag-create-button:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
