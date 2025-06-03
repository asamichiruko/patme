<script setup>
import { useRoute } from "vue-router"

const route = useRoute()
const isActive = (path) => route.path === path
</script>

<template>
  <nav class="tab-container">
    <RouterLink
      :to="{ name: 'entry' }"
      class="tab-button"
      :class="{ active: isActive('/') || isActive('/entry') }"
    >
      ホーム
    </RouterLink>
    <RouterLink
      :to="{ name: 'settings' }"
      class="tab-button"
      :class="{ active: isActive('/settings') }"
    >
      設定
    </RouterLink>
  </nav>
</template>

<style scoped>
.tab-container {
  display: flex;
  gap: 8px;
}
.tab-button {
  padding: 8px 16px;
  background-color: var(--color-tab-muted);
  color: var(--color-tab-muted-text);
  text-decoration: none;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
}
.tab-button.active {
  background-color: var(--color-tab-active);
  color: var(--color-tab-text);
}
.tab-button:focus-visible {
  outline: 2px solid var(--color-tab-focus);
  outline-offset: 2px;
  border-radius: 4px 4px 0 0;
}
</style>
