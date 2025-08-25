<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import AddCommentDialog from "@/components/entry/AddCommentDialog.vue"
import DeleteTagDialog from "@/components/tag/DeleteTagDialog.vue"
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import TabNavigation from "@/components/util/TabNavigation.vue"
import type { StorageService } from "@/services/StorageService"
import { useAuthStore } from "@/stores/useAuthStore"
import { computed, ref } from "vue"
import { RouterView, useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()

const storageReady = computed(() => Boolean(storageService))
const isAnonymous = ref(false)
const storageService = ref<StorageService | null>(null)

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
  <template v-if="!storageReady">
    <div>Loading...</div>
  </template>
  <template v-else>
    <header class="main-header">
      <div class="main-title">
        <h1><img :src="patmeImg" alt="" width="20px" height="20px" />ふりかえり帖</h1>
      </div>
      <div class="account-nav">
        <div v-if="!isAnonymous">
          <button class="logout-button" @click="logout">ログアウト</button>
        </div>
      </div>
    </header>
    <TabNavigation />
    <div class="container">
      <RouterView />
    </div>
    <AddCommentDialog />
    <TaggingDialog />
    <DeleteTagDialog />
  </template>
</template>

<style scoped>
header {
  display: flex;
  flex-wrap: wrap-reverse;
  gap: 32px;
  margin-bottom: 16px;
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
