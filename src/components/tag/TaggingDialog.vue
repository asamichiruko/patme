<script setup lang="ts">
import TagCreateInlineForm from "@/components/tag/TagCreateInlineForm.vue"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useTaggingDialog } from "@/composables/useTaggingDialog"
import { useEntryStore } from "@/stores/useEntryStore"
import { useTagStore } from "@/stores/useTagStore"
import { notify } from "@/utils/storageNotifier"
import { nextTick, ref, watch } from "vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const { visible, params, closeTaggingDialog } = useTaggingDialog()
const { trigger } = useNotificationBar()
const entryStore = useEntryStore()
const tagStore = useTagStore()

const dialogRef = ref<HTMLDialogElement | null>(null)
const tagListRef = ref<HTMLUListElement | null>(null)
const selectedTagIds = ref<string[]>([])
const loading = ref(false)

watch(visible, (val) => {
  if (val) {
    if (!params.value) return
    selectedTagIds.value = [...params.value.tagIds]
    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
  }
})

const handleTagCreated = async (tagId: string) => {
  if (!selectedTagIds.value.includes(tagId)) {
    selectedTagIds.value.push(tagId)
  }
  await nextTick(() => {
    const added = document.querySelector(`.tag[tag-id='${tagId}']`)
    added?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
    added?.classList.add("pulse")
    setTimeout(() => added?.classList.remove("pulse"), 300)
  })
}

const submit = async () => {
  if (!params.value) return
  try {
    loading.value = true
    await entryStore.updateEntryTags(params.value.entryId, selectedTagIds.value)
    notify()
    closeTaggingDialog()
  } catch (err) {
    console.log(err)
    trigger(`タグの紐づけに失敗しました。時間をおいて再度お試しください`, "error")
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  if (loading.value) return
  closeTaggingDialog()
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
          <button class="sub-button" type="button" @click="cancel">キャンセル</button>
          <button class="primary-button" type="submit">
            <LoadingSpinner v-if="loading" class="spinner" /> 決定
          </button>
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

.tag {
  display: inline-block;
  color: var(--color-tag-text);
  background-color: var(--color-tag);
  border: 1px dashed var(--color-tag-border);
  padding: 4px 16px;
  font-size: 14px;
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
}
.tag.selected {
  color: var(--color-tag-text);
  background-color: var(--color-tag-selected);
  border: 1px solid var(--color-tag-border);
}
.tag:focus-visible {
  outline: 1px solid var(--color-tag-focus);
  outline-offset: 1px;
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

.spinner {
  width: 16px;
  height: 16px;
  color: var(--color-sub-text);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
}
</style>
