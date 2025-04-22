<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  show: Boolean,
  initialTagIds: Array,
  allTags: Array,
})
const emit = defineEmits(["update:show", "submit", "cancel"])

const dialogRef = ref(null)
const selectedTagIds = ref([])

watch(
  () => props.show,
  (val) => {
    if (val) {
      selectedTagIds.value = Array.from(props.initialTagIds)
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
    }
  },
  { immediate: true },
)

const submit = () => {
  emit("submit", Array.from(selectedTagIds.value))
  emit("update:show", false)
}

const cancel = () => {
  emit("cancel")
  emit("update:show", false)
}

const toggleSelectedState = (id) => {
  const idx = selectedTagIds.value.indexOf(id)
  if (idx === -1) {
    selectedTagIds.value.push(id)
  } else {
    selectedTagIds.value.splice(idx, 1)
  }
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef" @cancel="cancel">
      <template v-if="show">
        <p class="message">割り当てるタグを選んでください</p>
        <form @submit.prevent="submit">
          <ul class="tag-list">
            <li v-for="tag in props.allTags" :key="tag.id">
              <button
                :class="['tag', { selected: selectedTagIds.includes(tag.id) }]"
                :aria-pressed="selectedTagIds.includes(tag.id)"
                type="button"
                @click="toggleSelectedState(tag.id)"
                :tag-id="tag.id"
              >
                {{ tag.title }}
              </button>
            </li>
          </ul>
          <div class="add-tag-form">
            <label>
              タグを追加
              <input class="new-tag-title" type="text" placeholder="新しいタグ" />
            </label>
            <button class="add-tag-button" type="button">追加</button>
          </div>
          <div class="actions">
            <button class="primary-button" type="submit">決定</button>
            <button class="primary-button" type="button" @click="cancel">キャンセル</button>
          </div>
        </form>
      </template>
    </dialog>
  </Teleport>
</template>

<style scoped>
dialog {
  border: none;
  border-radius: 8px;
  padding: 1em;
  max-width: 400px;
  width: 80%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tag-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.tag-option {
  display: inline-block;
}

.new-tag-title {
  padding: 5px;
  font-size: 14px;
  margin: 0 10px;
  width: 8em;
}
.add-tag-button {
  background-color: #3498db;
  color: white;
  border: none;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.add-tag-button:hover {
  background-color: #2980b9;
}
.add-tag-button:focus-visible {
  outline: 2px solid #4c9ffe;
  outline-offset: 2px;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 1em;
  margin-top: 2em;
}
</style>
