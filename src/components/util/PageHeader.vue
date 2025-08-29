<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import { useAuthStore } from "@/stores/useAuthStore"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import LoadingSpinner from "./LoadingSpinner.vue"

const props = defineProps<{
  showAccountNav: boolean
  logoTo: string
}>()

const router = useRouter()
const authStore = useAuthStore()

const showAccountNav = computed(() => props.showAccountNav && !authStore.isAnonymous)
const loading = ref(false)

const logout = async () => {
  if (loading.value) return
  try {
    loading.value = true
    await authStore.signOut()
    router.push("/login")
  } catch (err) {
    console.error("Logout error", err)
  } finally {
    loading.value = false
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
      <button class="sub-button slim-button" @click="logout">
        <LoadingSpinner v-if="loading" />
        <span class="button-label">ログアウト</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  display: flex;
  flex-wrap: wrap-reverse;
  align-items: center;
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
.slim-button {
  font-size: 15px;
  padding: 4px 12px;
}
</style>
