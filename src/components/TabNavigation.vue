<script setup>
defineProps({
  currentTab: String,
  tabs: Array,
})

defineEmits(["update:currentTab"])
</script>

<template>
  <div class="tab-container">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      :class="['tab-button', { active: currentTab === tab.key }]"
      @click="$emit('update:currentTab', tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.tab-container {
  display: flex;
  gap: 5px;
}
.tab-button {
  padding: 10px 20px;
  background-color: #f1f1f1;
  color: #333;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
}
.tab-button.active {
  background-color: #3498db;
  color: #fff;
}
.tab-button:focus-visible {
  outline: 2px solid #4c9ffe;
  outline-offset: 2px;
  border-radius: 4px 4px 0 0;
}
</style>
