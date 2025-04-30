<script setup>
import { ref, watch } from "vue"
import draggable from "vuedraggable"
import handleImg from "@/assets/handle.svg"
import { useNotification } from "@/composables/useNotification.js"

const { trigger } = useNotification()

const props = defineProps({
  allTags: Array,
})
const emit = defineEmits(["submit"])

const reorderedTags = ref([])
const saveEdits = () => {
  reorderedTags.value.forEach((tag, idx) => (tag.order = idx + 1))
  emit("submit", [...reorderedTags.value])
  trigger("タグの編集内容を保存しました", "success")
}
const resetEdits = () => {
  reorderedTags.value = [...props.allTags]
  reorderedTags.value.sort((a, b) => a.order - b.order)
  trigger("タグの編集内容を破棄しました", "info")
}

watch(
  () => props.allTags,
  (updated) => {
    reorderedTags.value = [...updated]
    reorderedTags.value.sort((a, b) => a.order - b.order)
  },
  { immediate: true },
)
</script>

<template>
  <form class="tag-manager" @submit.prevent="saveEdits">
    <ul class="tag-list">
      <draggable v-model="reorderedTags" item-key="id" handle=".drag-handle" tag="li">
        <template #item="{ element }">
          <li class="tag-list-item">
            <img class="drag-handle" :src="handleImg" alt="" width="20px" height="20px" />
            <span class="tag-title">{{ element.title }} / {{ element.order }}</span>
          </li>
        </template>
      </draggable>
    </ul>
    <div class="tag-edit-actions">
      <button type="button" class="cancel-button" @click="resetEdits">キャンセル</button>
      <button type="submit" class="primary-button">保存</button>
    </div>
  </form>
</template>

<style scoped>
.tag-manager {
  width: 600px;
}

.tag-list {
  list-style-type: none;
  padding: 16px;

  max-height: 400px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}
.tag-list-item {
  border-bottom: 1px solid var(--color-border);
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
.dragging {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.tag-title {
  display: inline-block;
  color: var(--color-text);
  height: 24px;
}

.tag-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
</style>
