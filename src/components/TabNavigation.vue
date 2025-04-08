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
.tab-button {
  padding: 10px 20px;
  background-color: #f1f1f1;
  color: #333;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
}
.tab-button.active {
  background-color: #3498db;
  color: #fff;
}
</style>
