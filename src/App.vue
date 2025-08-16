<script setup lang="ts">
import NotificationBar from "@/components/util/NotificationBar.vue"
import { RouterView } from "vue-router"
</script>

<template>
  <NotificationBar />
  <RouterView />
</template>
