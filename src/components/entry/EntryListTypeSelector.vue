<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: String,
})
// const emit = defineEmits(["update:modelValue"])

const options = [
  { value: "all", label: "すべて" },
  { value: "reviewed", label: "ふりかえり済み" },
  { value: "achievement", label: "よかったこと" },
  { value: "incomplete", label: "ふりかえりたいこと" },
  { value: "accepted", label: "受け入れたこと" },
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
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: #f8f8f8;
  color: #444;
}
.entry-type-option.selected {
  border-color: hsl(123, 40%, 50%);
  background-color: hsl(123, 40%, 94%);
  color: hsl(123, 40%, 34%);
  font-weight: 600;
}
.entry-type-option:focus-within {
  box-shadow: 0 0 0 3px hsla(123, 40%, 50%, 0.4);
}
</style>
