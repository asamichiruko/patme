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
    if (id && !selectedTagIds.value.includes(id)) {
      selectedTagIds.value.push(id)

      await nextTick(() => {
        const added = document.querySelector(`.tag[tag-id='${id}']`)
        added?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
        added?.classList.add("flash")
        setTimeout(() => added?.classList.remove("flash"), 800)
      })
    }
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
              タグを追加
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
  padding: 2px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5em;
  max-height: 200px;
  overflow-y: scroll;
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

@keyframes flash {
  0% {
    background-color: #e0e4e6;
  }
  100% {
    background-color: inherit;
  }
}
.tag.flash {
  animation: flash 0.8s ease-out;
}

.actions {
  display: flex;
  gap: 1em;
  margin-top: 2em;
}
</style>
