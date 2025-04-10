<script setup>
import { useNotification } from "@/composables/useNotification.js"

const { notification } = useNotification()
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
  padding: 0.5em;
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
  background-color: #2ecc71;
  color: white;
}
.notification.error {
  background-color: #e74c3c;
  color: white;
}
.notification.info {
  background-color: #3498db;
  color: white;
}
</style>
