<script setup>
import { computed, nextTick, ref, watch } from "vue"
import TagCreateInlineForm from "@/components/tag/TagCreateInlineForm.vue"
import { useDialogStore } from "@/composables/useDialogStore.js"
import { useTagStore } from "@/stores/useTagStore.js"

const emit = defineEmits(["submit", "cancel"])

const { activeDialog, dialogParams, close } = useDialogStore()
const tagStore = useTagStore()
const allTags = ref(tagStore.getTagsOrdered())

const dialogRef = ref(null)
const tagListRef = ref(null)

const selectedTagIds = ref([])
const initialTagIds = computed(() => dialogParams.value?.initialTagIds ?? [])

watch(activeDialog, (val) => {
  if (val === "tagging") {
    selectedTagIds.value = [...initialTagIds.value]
    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
  }
})

const handleTagCreated = async (tag) => {
  if (!tag) {
    return
  }
  if (!selectedTagIds.value.includes(tag.id)) {
    selectedTagIds.value.push(tag.id)
  }
  await nextTick(() => {
    const added = document.querySelector(`.tag[tag-id='${tag.id}']`)
    added?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
    added?.classList.add("pulse")
    setTimeout(() => added?.classList.remove("pulse"), 300)
  })
}

const submit = () => {
  emit("submit", selectedTagIds.value)
  close(selectedTagIds.value)
}

const cancel = () => {
  emit("cancel")
  close(null)
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
      <p class="message">割り当てるタグを選んでください</p>
      <form @submit.prevent="submit">
        <ul class="tag-list" ref="tagListRef">
          <li v-for="tag in allTags" :key="tag.id">
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
        <TagCreateInlineForm @tag-created="handleTagCreated" />
        <div class="actions">
          <button class="cancel-button" type="button" @click="cancel">キャンセル</button>
          <button class="primary-button" type="submit">決定</button>
        </div>
      </form>
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
