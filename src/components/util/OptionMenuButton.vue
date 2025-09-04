<script setup lang="ts">
import { useOptionMenu, type Option, type OptionHandler } from "@/composables/useOptionMenu"

const { showMenu } = useOptionMenu()

const props = defineProps<{
  options: Option[]
  handler: OptionHandler
  params: Record<string, unknown>
}>()

const openMenu = (e: MouseEvent) => {
  showMenu(props.options, { x: e.clientX, y: e.clientY }, props.handler, props.params)
}
</script>

<template>
  <button type="button" class="option-menu-button" @click="openMenu">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="9" r="1" />
      <circle cx="12" cy="2" r="1" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  </button>
</template>

<style scoped>
.option-menu-button {
  background: none;
  cursor: pointer;
}
</style>
