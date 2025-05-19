<script setup>
import { nextTick, ref, watch } from "vue"
import TagCreateInlineForm from "./TagCreateInlineForm.vue"

const props = defineProps({
  show: Boolean,
  initialTagIds: Array,
  allTags: Array,
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

const selectTagById = async (id) => {
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
}

const submit = () => {
  emit("submit", Array.from(selectedTagIds.value))
  emit("update:show", false)
}

const cancel = () => {
  emit("cancel")
  emit("update:show", false)
}

const handleCreateTag = (title) => {
  emit("add-tag", title)
}

const toggleSelectedState = (id) => {
  const idx = selectedTagIds.value.indexOf(id)
  if (idx === -1) {
    selectedTagIds.value.push(id)
  } else {
    selectedTagIds.value.splice(idx, 1)
  }
}

defineExpose({
  selectTagById,
})
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
          <TagCreateInlineForm @create-tag="handleCreateTag" />
          <div class="actions">
            <button class="cancel-button" type="button" @click="cancel">キャンセル</button>
            <button class="primary-button" type="submit">決定</button>
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
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
}
</style>
