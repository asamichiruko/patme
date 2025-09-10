<script setup lang="ts">
import type { EntryType } from "@/schemas/EntryType"
import { computed } from "vue"

const props = defineProps<{
  modelValue: EntryType
  showHint: boolean
  initialType?: EntryType
}>()
const emit = defineEmits(["update:modelValue"])

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
})

const options: { value: EntryType; label: string; hint: string }[] = [
  { value: "achievement", label: "嬉しい", hint: "成功・努力・喜び" },
  { value: "incomplete", label: "モヤモヤ", hint: "失敗・後悔・つまずき" },
  { value: "accepted", label: "気づき", hint: "客観的な感想" },
]
</script>

<template>
  <div class="entry-type-selector">
    <label
      v-for="option in options"
      :key="option.value"
      :class="['entry-type-option', { selected: localValue === option.value }, option.value]"
    >
      <input type="radio" name="entryType" :value="option.value" v-model="localValue" />
      <div class="entry-type-label">
        <div class="entry-type-name">{{ option.label }}</div>
        <div v-if="props.showHint" class="entry-type-hint">
          {{ option.hint }}
        </div>
        <div>
          <small v-if="props.initialType && option.value === props.initialType">
            （元の記録と同じ評価）
          </small>
        </div>
      </div>
    </label>
  </div>
</template>

<style scoped>
.entry-type-selector {
  display: flex;
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
  padding: 6px 12px;
  border: 2px solid transparent;
  border-radius: 6px;
  background-color: var(--color-bg);
  cursor: pointer;
  font-size: 16px;
  width: 180px;
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
  font-weight: normal;
  color: var(--color-subtext);
}
</style>
