<script setup>
import { useNotificationBar } from "@/composables/useNotificationBar.js"
import { useEntryStore } from "@/stores/useEntryStore.js"
import { ref } from "vue"

const entryStore = useEntryStore()
const { trigger } = useNotificationBar()
const text = ref("")
const textareaRef = ref(null)
const entryType = ref("achievement")

const submit = () => {
  const content = text.value.trim()
  if (!content) {
    trigger("記録内容を入力してください", "error")
    return
  }
  const result = entryStore.addAchievement({
    content,
    date: new Date(),
    entryType: entryType.value,
  })
  if (result) {
    text.value = ""
    trigger("記録しました！", "success")
  } else {
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  }
}

const options = [
  { value: "achievement", label: "よかったこと", hint: "成功・努力・喜び" },
  { value: "incomplete", label: "ふりかえりたいこと", hint: "失敗・後悔・つまずき" },
  { value: "accepted", label: "受け入れたこと", hint: "客観的な感想" },
]
</script>

<template>
  <form @submit.prevent="submit">
    <fieldset class="entry-type-selector">
      <legend class="header-label">記録のタイプ</legend>
      <label
        v-for="option in options"
        :key="option.value"
        :class="['entry-type-option', { selected: entryType === option.value }, option.value]"
      >
        <input
          type="radio"
          name="entryType"
          :value="option.value"
          v-model="entryType"
          class="visually-hidden"
        />
        <div class="entry-type-label">
          {{ option.label }}
          <small class="entry-type-hint">{{ option.hint }}</small>
        </div>
      </label>
    </fieldset>
    <label>
      <div class="header-label">記録する内容</div>
      <textarea
        ref="textareaRef"
        v-model="text"
        @keydown.ctrl.enter="submit"
        placeholder="どんなことがありましたか？"
      ></textarea>
    </label>
    <div class="actions">
      <button class="primary-button" type="submit">記録する</button>
    </div>
  </form>
</template>

<style scoped>
.header-label {
  margin-top: 24px;
  margin-bottom: 8px;
  font-size: 18px;
}
textarea {
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
.actions {
  display: flex;
  justify-content: flex-end;
}

fieldset {
  border: none;
  margin: 0;
  padding: 0;
}
.entry-type-selector {
  display: flex;
  gap: 8px;
  margin: 8px 0;
}

.entry-type-option {
  padding: 6px 12px;
  border: 2px solid transparent;
  border-radius: 6px;
  background-color: hsl(0, 0%, 97%);
  cursor: pointer;
  font-size: 16px;
}

.entry-type-option.achievement {
  background-color: hsl(36, 100%, 94%);
  border-color: hsl(36, 100%, 85%);
  color: hsl(36, 100%, 38%);
}
.entry-type-option.achievement.selected {
  border-color: hsl(36, 100%, 40%);
}
.entry-type-option.achievement:focus-within {
  box-shadow: 0 0 0 3px hsla(36, 100%, 50%, 0.4);
}

.entry-type-option.incomplete {
  background-color: hsl(207, 80%, 94%);
  border-color: hsl(207, 80%, 85%);
  color: hsl(207, 80%, 38%);
}
.entry-type-option.incomplete.selected {
  border: 2px solid hsl(207, 80%, 40%);
}
.entry-type-option.incomplete:focus-within {
  box-shadow: 0 0 0 3px hsla(207, 80%, 50%, 0.4);
}

.entry-type-option.accepted {
  background-color: hsl(123, 40%, 94%);
  border-color: hsl(123, 40%, 85%);
  color: hsl(123, 40%, 38%);
}
.entry-type-option.accepted.selected {
  border: 2px solid hsl(123, 40%, 40%);
}
.entry-type-option.accepted:focus-within {
  box-shadow: 0 0 0 3px hsla(123, 40%, 50%, 0.4);
}

.entry-type-option:focus-within {
  outline: none;
}

.visually-hidden {
  position: fixed;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  opacity: 0;
  overflow: hidden;
  border: none;
  margin: 0;
  padding: 0;
  display: block;
  white-space: nowrap;
}

.entry-type-hint {
  display: block;
  font-size: 12px;
  color: #666;
}
</style>
