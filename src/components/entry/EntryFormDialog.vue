<script setup lang="ts">
import { useEntryFormDialog } from "@/composables/useEntryFormDialog"
import { useNotificationBar } from "@/composables/useNotificationBar"
import type { Entry } from "@/schemas/Entry"
import type { EntryType } from "@/schemas/EntryType"
import { useEntryStore } from "@/stores/useEntryStore"
import { notify } from "@/utils/storageNotifier"
import { ref, watch } from "vue"
import BaseDialog from "../util/BaseDialog.vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"
import EntryTypeSelector from "./EntryTypeSelector.vue"

const { visible, params, closeEntryFormDialog } = useEntryFormDialog()
const entryStore = useEntryStore()
const { trigger } = useNotificationBar()

const content = ref("")
const selectedEntryType = ref<EntryType>("achievement")
const loading = ref(false)

watch(visible, (val) => {
  if (val) {
    content.value = params.value?.initialContent ?? ""
    selectedEntryType.value = params.value?.initialEntryType ?? "achievement"
  }
})

const closeDialog = () => {
  content.value = ""
  selectedEntryType.value = "achievement"
  closeEntryFormDialog()
}

const submit = async () => {
  if (!params.value) return

  const entryBody: Omit<Entry, "id" | "entryId" | "createdAt"> | null = {
    content: content.value,
    entryType: selectedEntryType.value,
    reviewedCount: params.value.initialReviewedCount ?? 0,
    tagIds: params.value.initialTagIds ?? [],
  }

  loading.value = true
  try {
    if (params.value.action === "create") {
      await entryStore.createEntry(entryBody)
    } else if (params.value.action === "update" && params.value.entryId) {
      await entryStore.updateEntry(params.value.entryId, entryBody)
    } else {
      throw new Error("Invalid comment action")
    }
    notify()
    closeDialog()
  } catch (err) {
    console.error(err)
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  if (loading.value) return
  closeDialog()
}
</script>

<template>
  <BaseDialog :visible="visible" @submit="submit" @close="cancel">
    <template #title>
      <h2>ふりかえりの記録</h2>
    </template>
    <div class="comment-container">
      <fieldset>
        <legend class="label-header">記録の分類</legend>
        <EntryTypeSelector v-model="selectedEntryType" :show-hint="false" />
      </fieldset>
      <label>
        <div class="label-header">記録する内容</div>
        <textarea
          v-model="content"
          @keydown.ctrl.enter="submit"
          placeholder="どんなことがありましたか？"
          class="content"
          required
        ></textarea>
      </label>
    </div>
    <template #actions>
      <button class="sub-button" type="button" @click="cancel">キャンセル</button>
      <button class="primary-button" type="submit">
        <LoadingSpinner v-if="loading" class="spinner" />
        <span class="button-label">記録する</span>
      </button>
    </template>
  </BaseDialog>
</template>

<style scoped>
legend {
  margin: 0;
  padding: 0;
  width: 100%;
}
fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
}

h2 {
  padding-bottom: 8px;
}

.label-header {
  margin-bottom: 8px;
}

.comment-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.content {
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 16px;
  display: block;
  width: -webkit-fill-available;
  width: -moz-available;
  width: stretch;
  height: 60px;
  line-height: 1.6;
}
</style>
