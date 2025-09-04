<script setup lang="ts">
import { useOptionMenu } from "@/composables/useOptionMenu"

const { isVisible, options, position, executeHandler } = useOptionMenu()
</script>

<template>
  <div
    v-if="isVisible"
    class="option-menu"
    :style="{ top: `${position.y}px`, left: `${position.x}px` }"
  >
    <ul class="option-list">
      <li v-for="(option, index) in options" :key="index" @click="executeHandler(option)">
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.option-menu {
  position: fixed;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 1000;
}

.option-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.option-list li {
  padding: 8px 16px;
  cursor: pointer;
}

.option-list li:hover {
  background-color: #f0f0f0;
}
</style>
