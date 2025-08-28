<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import { useAuthStore } from "@/stores/useAuthStore"
import { computed } from "vue"
import { useRouter } from "vue-router"

const props = defineProps<{
  showAccountNav: boolean
  logoTo: string
}>()

const router = useRouter()
const authStore = useAuthStore()

const showAccountNav = computed(() => props.showAccountNav && !authStore.isAnonymous)

const logout = async () => {
  try {
    await authStore.signOut()
    router.push("/login")
  } catch (err) {
    console.error("Logout error", err)
  }
}
</script>

<template>
  <header class="main-header">
    <h1 class="main-title">
      <RouterLink :to="props.logoTo">
        <img :src="patmeImg" alt="" width="20px" height="20px" />ふりかえり帖
      </RouterLink>
    </h1>
    <div class="account-nav" v-if="showAccountNav">
      <button class="logout-button" @click="logout">ログアウト</button>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  display: flex;
  flex-wrap: wrap-reverse;
  gap: 32px;
  margin-bottom: 32px;
}

.main-title {
  text-align: left;
  font-size: 24px;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

.main-title a {
  color: var(--color-header);
  text-decoration: none;
}

.main-title img {
  margin-right: 8px;
}

.account-nav {
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.logout-button {
  background-color: var(--color-sub);
  color: var(--color-sub-text);
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s;
}
.logout-button:hover {
  background-color: var(--color-sub-hover);
}
.logout-button:focus-visible {
  outline: 2px solid var(--color-sub-focus);
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
