<script setup lang="ts">
import TagCreateInlineForm from "@/components/tag/TagCreateInlineForm.vue"
import { useTaggingDialog } from "@/composables/useTaggingDialog"
import type { Tag } from "@/schemas/Tag"
import { useTagStore } from "@/stores/useTagStore.js"
import { nextTick, ref, watch } from "vue"

const emit = defineEmits(["submit", "cancel"])

const { isOpen, initialTagIds, closeTaggingDialog } = useTaggingDialog()
const tagStore = useTagStore()

const dialogRef = ref<HTMLDialogElement | null>(null)
const tagListRef = ref<HTMLUListElement | null>(null)
const selectedTagIds = ref<string[]>([])

watch(isOpen, (val) => {
  if (val) {
    selectedTagIds.value = [...initialTagIds.value]
    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
  }
})

const handleTagCreated = async (tag: Tag) => {
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
  closeTaggingDialog(selectedTagIds.value)
}

const cancel = () => {
  emit("cancel")
  closeTaggingDialog(null)
}

const toggleSelectedState = (id: string) => {
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
          <li v-for="tag in tagStore.tags" :key="tag.id">
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
        <TagCreateInlineForm @tag-created="handleTagCreated" labeltext="タグを追加" />
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
