<script setup lang="ts">
import { useNotificationBar } from "@/composables/useNotificationBar"

const { notification } = useNotificationBar()
</script>

<template>
  <transition name="fade">
    <div v-if="notification.show" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </transition>
</template>

<style scoped>
.notification {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 8px;
  text-align: center;
  z-index: 1000;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-leave-active {
  transition: opacity 0.3s;
}

.notification.success {
  background-color: var(--color-success);
  color: var(--color-note-text);
}
.notification.error {
  background-color: var(--color-error);
  color: var(--color-note-text);
}
.notification.info {
  background-color: var(--color-info);
  color: var(--color-note-text);
}
</style>
