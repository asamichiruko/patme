<script setup lang="ts">
import EntryTypeSelector from "@/components/entry/EntryTypeSelector.vue"
import { useNotificationBar } from "@/composables/useNotificationBar"
import type { EntryType } from "@/schemas/EntryType"
import { useEntryStore } from "@/stores/useEntryStore"
import { notify } from "@/utils/storageNotifier"
import { ref } from "vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const entryStore = useEntryStore()
const { trigger } = useNotificationBar()
const text = ref<string>("")
const textareaRef = ref(null)
const entryType = ref<EntryType>("achievement")
const loading = ref(false)

const submit = async () => {
  if (loading.value) return

  const content = text.value.trim()
  const _entryType = entryType.value
  if (!content) {
    trigger("記録内容を入力してください", "error")
    return
  }

  loading.value = true
  entryStore
    .createEntry({
      content,
      entryType: _entryType,
      reviewedCount: 0,
      tagIds: [],
    })
    .then(() => {
      text.value = ""
      entryType.value = "achievement"
      loading.value = false
      notify()
    })
    .catch(() => {
      trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
      text.value = content
      entryType.value = _entryType
      loading.value = false
    })
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="header-label">記録の分類</div>
    <EntryTypeSelector v-model="entryType" :show-hint="true" />
    <label>
      <div class="header-label">記録する内容</div>
      <textarea
        ref="textareaRef"
        v-model="text"
        @keydown.ctrl.enter="submit"
        placeholder="どんなことがありましたか？"
        :class="['entry-content', entryType]"
      ></textarea>
    </label>
    <div class="actions">
      <button class="primary-button" type="submit">
        <LoadingSpinner v-if="loading" class="spinner" />
        <span class="button-label">記録する</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
.header-label {
  margin-top: 24px;
  margin-bottom: 8px;
  font-size: 18px;
}
.entry-content {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  height: 100px;
  font-size: 16px;
  margin-bottom: 8px;
  line-height: 1.6;
}
.entry-content.achievement {
  box-shadow: inset 5px 0 var(--color-entry-type-achievement-border);
}
.entry-content.incomplete {
  box-shadow: inset 5px 0 var(--color-entry-type-incomplete-border);
}
.entry-content.accepted {
  box-shadow: inset 5px 0 var(--color-entry-type-accepted-border);
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
