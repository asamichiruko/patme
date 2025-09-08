<script setup lang="ts">
import { useOptionMenu } from "@/composables/useOptionMenu"
import { computed, nextTick, ref, watch } from "vue"

const { isVisible, options, position, executeHandler, hideMenu } = useOptionMenu()

const menuStyle = computed(() => {
  return { top: `${position.value.y}px`, left: `${position.value.x}px` }
})

const menuItems = ref<HTMLElement[]>([])

watch(isVisible, async (val) => {
  if (val) {
    await nextTick()
    menuItems.value[0]?.focus()
  }
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    e.preventDefault()
    e.stopPropagation()
    hideMenu()
  } else if (e.key === "Tab" || e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault()
    const current = document.activeElement as HTMLElement
    const index = menuItems.value.indexOf(current)
    const length = menuItems.value.length
    if ((e.key === "Tab" && e.shiftKey) || e.key === "ArrowUp") {
      menuItems.value[(index - 1 + length) % length].focus()
    } else {
      menuItems.value[(index + 1) % length].focus()
    }
  }
}
</script>

<template>
  <div v-if="isVisible" class="option-menu" :style="menuStyle" @keydown="handleKeyDown">
    <ul class="option-list">
      <li v-for="(option, index) in options" :key="index">
        <button class="option-item" type="button" ref="menuItems" @click="executeHandler(option)">
          {{ option.label }}
        </button>
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

@media (max-width: 768px) {
  .option-menu {
    transform: translateY(-100%);
  }
}

.option-item {
  padding: 8px 16px;
  cursor: pointer;
}

.option-item:hover {
  background-color: #f0f0f0;
}
.option-item:focus-visible {
  background-color: #f0f0f0;
}
</style>
