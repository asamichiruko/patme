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
    <div class="header-label">記録のタイプ</div>
    <div class="entry-type-selector">
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
    </div>
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

.entry-type-selector {
  display: flex;
  gap: 8px;
  margin: 8px 0;
  flex-wrap: wrap;
}

.entry-type-option {
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

.entry-type-hint {
  display: block;
  font-size: 12px;
  color: var(--color-subtext);
}
</style>
