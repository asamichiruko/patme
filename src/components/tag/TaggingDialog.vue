<script setup lang="ts">
import TagCreateInlineForm from "@/components/tag/TagCreateInlineForm.vue"
import { useNotificationBar } from "@/composables/useNotificationBar"
import { useTaggingDialog } from "@/composables/useTaggingDialog"
import { useEntryStore } from "@/stores/useEntryStore"
import { useTagStore } from "@/stores/useTagStore"
import { notify } from "@/utils/storageNotifier"
import { nextTick, ref, watch } from "vue"
import BaseDialog from "../util/BaseDialog.vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"
import TagSelector from "./TagSelector.vue"

const { visible, params, closeTaggingDialog } = useTaggingDialog()
const { trigger } = useNotificationBar()
const entryStore = useEntryStore()
const tagStore = useTagStore()

const selectedTagIds = ref<Set<string>>(new Set())
const loading = ref(false)

watch(visible, (val) => {
  if (val && params.value) {
    selectedTagIds.value = new Set(params.value.tagIds)
  }
})

const handleTagCreated = async (tagId: string) => {
  if (!selectedTagIds.value.has(tagId)) {
    selectedTagIds.value.add(tagId)
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
    await entryStore.updateEntryTags(params.value.entryId, [...selectedTagIds.value])
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
</script>

<template>
  <BaseDialog :visible="visible" @submit="submit" @close="cancel">
    <template #title>
      <h2>タグの割り当て</h2>
    </template>
    <p>割り当てるタグを選んでください</p>
    <TagSelector :tags="tagStore.tags" v-model="selectedTagIds" />
    <TagCreateInlineForm @tag-created="handleTagCreated" labeltext="タグを追加" />
    <template #actions>
      <button class="sub-button" type="button" @click="cancel">キャンセル</button>
      <button class="primary-button" type="submit">
        <LoadingSpinner v-if="loading" class="spinner" />
        <span class="button-label">決定</span>
      </button>
    </template>
  </BaseDialog>
</template>

<style scoped>
h2 {
  padding-bottom: 8px;
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
</style>
