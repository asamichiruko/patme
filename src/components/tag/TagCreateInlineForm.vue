<script setup lang="ts">
import { useTagStore } from "@/stores/useTagStore"
import { computed, ref } from "vue"

const props = defineProps<{
  labeltext: string
}>()
const emit = defineEmits(["tag-created"])
const newTagTitle = ref("")
const tagStore = useTagStore()

const isVisibleLabel = computed(() => props.labeltext.trim() !== "")

const handleCreateTag = async () => {
  const trimmed = newTagTitle.value.trim()
  if (!trimmed) {
    return
  }

  let result = null
  const existing = await tagStore.getTagByTitle(trimmed)
  if (existing) {
    result = existing.id
  } else {
    result = tagStore.createTag({ title: trimmed })
  }
  if (!result) return

  emit("tag-created", result)
  newTagTitle.value = ""
}
</script>

<template>
  <div class="tag-create-form">
    <label>
      <span class="new-tag-label" :class="{ 'sr-only': !isVisibleLabel }">{{
        props.labeltext || "タグ名"
      }}</span>
      <input
        class="new-tag-title"
        id="new-tag-title"
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
  margin-right: 8px;
}
.new-tag-title {
  padding: 8px;
  font-size: 15px;
  margin-right: 8px;
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
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
