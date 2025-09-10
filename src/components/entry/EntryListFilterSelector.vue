<script setup lang="ts">
import { ref, watch } from "vue"

const props = defineProps<{
  modelValue: string
}>()
// const emit = defineEmits(["update:modelValue"])

const options = [
  { value: "all", label: "すべて" },
  { value: "reviewed", label: "分類コメントあり" },
  { value: "achievement", label: "嬉しい" },
  { value: "incomplete", label: "モヤモヤ" },
  { value: "accepted", label: "気づき" },
]

const localValue = ref(props.modelValue)
watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val
  },
)
</script>

<template>
  <div class="entry-type-selector">
    <div class="visually-hidden">表示する記録</div>
    <label
      v-for="option in options"
      :key="option.value"
      :class="['entry-type-option', { selected: modelValue === option.value }]"
    >
      <input
        type="radio"
        name="viewEntryType"
        :value="option.value"
        v-model="localValue"
        @change="$emit('update:modelValue', localValue)"
        class="visually-hidden"
      />
      <div class="entry-type-label">{{ option.label }}</div>
    </label>
  </div>
</template>

<style scoped>
.entry-type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.entry-type-option {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid var(--color-entry-type-filter-border);
  cursor: pointer;
  background-color: var(--color-entry-type-filter-bg);
  color: var(--color-entry-type-filter-text);
}
.entry-type-option.selected {
  border-color: var(--color-entry-type-filter-selected-border);
  background-color: var(--color-entry-type-filter-selected-bg);
  color: var(--color-entry-type-filter-selected-text);
  font-weight: 600;
}
.entry-type-option:focus-within {
  outline: 1px solid var(--color-entry-type-filter-selected-border);
  outline-offset: 2px;
  border-radius: 20px;
}
</style>
