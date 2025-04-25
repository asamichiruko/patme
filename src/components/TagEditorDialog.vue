<script setup>
import { nextTick, ref, watch } from "vue"

const props = defineProps({
  show: Boolean,
  initialTagIds: Array,
  allTags: Array,
  addRequestedTagId: String,
})
const emit = defineEmits(["update:show", "submit", "cancel", "add-tag"])

const dialogRef = ref(null)
const tagListRef = ref(null)
const selectedTagIds = ref([])
const newTagTitle = ref("")

watch(
  () => props.show,
  (val) => {
    if (val) {
      selectedTagIds.value = Array.from(props.initialTagIds)
      newTagTitle.value = ""
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
    }
  },
  { immediate: true },
)

watch(
  () => props.addRequestedTagId,
  async (id) => {
    if (!id) {
      return
    }
    if (!selectedTagIds.value.includes(id)) {
      selectedTagIds.value.push(id)
    }
    await nextTick(() => {
      const added = document.querySelector(`.tag[tag-id='${id}']`)
      added?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
      added?.classList.add("pulse")
      setTimeout(() => added?.classList.remove("pulse"), 300)
    })
  },
)

const submit = () => {
  emit("submit", Array.from(selectedTagIds.value))
  emit("update:show", false)
}

const cancel = () => {
  emit("cancel")
  emit("update:show", false)
}

const addTag = () => {
  const title = newTagTitle.value.trim()
  if (title) {
    emit("add-tag", newTagTitle.value)
    newTagTitle.value = ""
  }
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
          <ul class="tag-list" ref="tagListRef">
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
              <span class="new-tag-label">タグを追加</span>
              <input
                class="new-tag-title"
                type="text"
                v-model="newTagTitle"
                @keydown.enter.prevent="addTag"
                placeholder="新しいタグ"
              />
            </label>
            <button class="add-tag-button" type="button" @click="addTag">追加</button>
          </div>
          <div class="actions">
            <button class="primary-button" type="submit">決定</button>
            <button class="cancel-button" type="button" @click="cancel">キャンセル</button>
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
  padding: 16px;
  max-width: 400px;
  width: 80%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tag-list {
  list-style-type: none;
  padding: 16px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px 8px;
  max-height: 200px;
  overflow-y: scroll;
}

.tag {
  transition: background-color 0.3s;
}
.tag:hover {
  background-color: var(--color-tag-hover);
}
.tag.selected:hover {
  background-color: var(--color-tag-selected-hover);
}

.new-tag-label {
  font-size: 15px;
}
.new-tag-title {
  padding: 8px;
  font-size: 15px;
  margin: 0 8px;
  width: 100px;
}
.add-tag-button {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
  border: none;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.add-tag-button:hover {
  background-color: var(--color-primary-hover);
}
.add-tag-button:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
  border-radius: 4px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
  }
}
.tag.pulse {
  animation: pulse 0.2s ease-out;
}

.actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}
</style>
