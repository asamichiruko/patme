<script setup lang="ts">
import { useAddCommentDialog } from "@/composables/useAddCommentDialog.js"
import type { Comment } from "@/schemas/Comment"
import type { EntryType } from "@/schemas/EntryType"
import { ref, watch } from "vue"

const emit = defineEmits(["submit", "cancel"])

const { isOpen, originalEntryType, closeAddComment } = useAddCommentDialog()

const dialogRef = ref<HTMLDialogElement | null>(null)
const inputValue = ref("")
const showTypeReset = ref(false)
const selectedType = ref<EntryType | null>(null)

watch(isOpen, (val) => {
  if (val) {
    inputValue.value = ""
    showTypeReset.value = false
    selectedType.value = null
    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
  }
})

watch(showTypeReset, (val) => {
  if (val) {
    selectedType.value = "achievement"
  } else {
    selectedType.value = null
  }
})

const submit = () => {
  const result: Omit<Comment, "id" | "entryId" | "createdAt"> | null = {
    content: inputValue.value,
    reviewType: selectedType.value,
  }
  emit("submit", result)
  closeAddComment(result)
}

const cancel = () => {
  emit("cancel")
  closeAddComment(null)
}

const options = [
  { value: "achievement", label: "よかったこと" },
  { value: "incomplete", label: "ふりかえりたいこと" },
  { value: "accepted", label: "受け入れたこと" },
]
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef" @cancel="cancel">
      <form @submit.prevent="submit" class="comment-container">
        <label>
          <div class="label-header">ふりかえりコメント</div>
          <textarea
            v-model="inputValue"
            @keydown.ctrl.enter="submit"
            placeholder="この記録について、現在はどう感じますか？"
            class="content"
            required
          ></textarea>
        </label>
        <label>
          <input type="checkbox" v-model="showTypeReset" />
          記録の再評価（改めてふりかえる）
        </label>
        <div v-if="showTypeReset">
          <fieldset class="entry-type-selector">
            <legend class="label-header">新しい評価</legend>
            <label
              v-for="option in options"
              :key="option.value"
              :class="[
                'entry-type-option',
                { selected: selectedType === option.value },
                option.value,
              ]"
            >
              <input
                type="radio"
                name="newEntryType"
                :value="option.value"
                v-model="selectedType"
              />
              <div class="entry-type-label">
                {{ option.label }}
                <small v-if="originalEntryType === option.value"> （以前と同じ評価） </small>
              </div>
            </label>
          </fieldset>
        </div>
        <div class="actions">
          <button class="cancel-button" type="button" @click="cancel">キャンセル</button>
          <button class="primary-button" type="submit">記録する</button>
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
  max-width: 480px;
  width: 80%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

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

.entry-type-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px 0;
  flex-wrap: wrap;
}

input[type="radio"] {
  margin: 0;
  padding: 0;
}
.entry-type-option {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: fit-content;
  padding: 6px 12px;
  border: 2px solid transparent;
  border-radius: 6px;
  background-color: var(--color-bg);
  cursor: pointer;
  font-size: 16px;
}

.entry-type-option.achievement {
  background-color: var(--color-entry-type-achievement-bg);
  border-color: var(--color-entry-type-achievement-border);
  color: var(--color-entry-type-achievement-text);
}
.entry-type-option.achievement.selected {
  border-color: var(--color-entry-type-achievement-text);
}
.entry-type-option.achievement:focus-within {
  outline: 2px solid var(--color-entry-type-achievement-border);
  outline-offset: 2px;
  border-radius: 4px;
}

.entry-type-option.incomplete {
  background-color: var(--color-entry-type-incomplete-bg);
  border-color: var(--color-entry-type-incomplete-border);
  color: var(--color-entry-type-incomplete-text);
}
.entry-type-option.incomplete.selected {
  border: 2px solid var(--color-entry-type-incomplete-text);
}
.entry-type-option.incomplete:focus-within {
  outline: 2px solid var(--color-entry-type-incomplete-border);
  outline-offset: 2px;
  border-radius: 4px;
}

.entry-type-option.accepted {
  background-color: var(--color-entry-type-accepted-bg);
  border-color: var(--color-entry-type-accepted-border);
  color: var(--color-entry-type-accepted-text);
}
.entry-type-option.accepted.selected {
  border: 2px solid var(--color-entry-type-accepted-text);
}
.entry-type-option.accepted:focus-within {
  outline: 2px solid var(--color-entry-type-accepted-border);
  outline-offset: 2px;
  border-radius: 4px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}
</style>
