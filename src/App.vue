<script setup lang="ts">
import NotificationBar from "@/components/util/NotificationBar.vue"
import { onBeforeUnmount, onMounted } from "vue"
import { RouterView } from "vue-router"
import OptionMenu from "./components/util/OptionMenu.vue"
import { useOptionMenu } from "./composables/useOptionMenu"

const { handleDocumentClick } = useOptionMenu()

onMounted(() => {
  document.addEventListener("click", handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick)
})
</script>

<template>
  <NotificationBar />
  <RouterView />
  <OptionMenu />
</template>
