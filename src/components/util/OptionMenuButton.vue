<script setup lang="ts">
import { useOptionMenu, type Option, type OptionHandler } from "@/composables/useOptionMenu"
import { ref } from "vue"

const { showMenu } = useOptionMenu()

const props = defineProps<{
  options: Option[]
  handler: OptionHandler
  params: Record<string, unknown>
}>()

const buttonElement = ref<HTMLButtonElement | null>(null)

const openMenu = (e: Event) => {
  e.preventDefault()
  const rect = buttonElement.value!.getBoundingClientRect()
  showMenu(
    props.options,
    { x: rect.left, y: rect.bottom },
    props.handler,
    props.params,
    buttonElement.value,
  )
}
</script>

<template>
  <button type="button" class="option-menu-button" @click="openMenu" ref="buttonElement">
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
  cursor: pointer;
}
.option-menu-button:focus-visible {
  outline-offset: 2px;
  border-radius: 4px;
  outline-width: 2px;
  outline: 2px solid var(--color-border);
}
</style>
