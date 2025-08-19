<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import DeleteUserDialog from "@/components/data/DeleteUserDialog.vue"
import AddCommentDialog from "@/components/entry/AddCommentDialog.vue"
import DeleteTagDialog from "@/components/tag/DeleteTagDialog.vue"
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import TabNavigation from "@/components/util/TabNavigation.vue"
import { auth } from "@/firebase"
import { createStorageService } from "@/services/createStorageService"
import type { StorageService } from "@/services/StorageService"
import { useCommentStore } from "@/stores/useCommentStore"
import { useDataTransferStore } from "@/stores/useDataTransferStore"
import { useEntryStore } from "@/stores/useEntryStore"
import { useTagStore } from "@/stores/useTagStore"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { computed, ref } from "vue"
import { RouterView, useRouter } from "vue-router"

const entryStore = useEntryStore()
const tagStore = useTagStore()
const commentStore = useCommentStore()
const dataTransferStore = useDataTransferStore()
const router = useRouter()

const storageReady = computed(() => Boolean(storageService))
const isAnonymous = ref(false)
const storageService = ref<StorageService | null>(null)

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    isAnonymous.value = false
    storageService.value = null
    entryStore.reset()
    commentStore.reset()
    tagStore.reset()
    dataTransferStore.reset()
    router.push("/login")
    return
  }

  isAnonymous.value = user.isAnonymous

  if (!storageService.value) {
    const uid = user.uid
    const backend = import.meta.env.VITE_STORAGE_BACKEND
    if (backend === "local") {
      storageService.value = createStorageService({ backend: "local" })
    } else if (backend === "firestore") {
      storageService.value = createStorageService({ backend: "firestore", uid })
    } else {
      throw new Error(`Invalid backend`)
    }

    await Promise.all([entryStore.fetchEntriesWithRelations(), tagStore.fetchTags()])
  }
})

const logout = async () => {
  try {
    await signOut(auth)
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
    <header>
      <div class="index-title">
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
    <DeleteUserDialog />
  </template>
</template>

<style scoped>
header {
  display: flex;
  flex-wrap: wrap-reverse;
  gap: 32px;
  margin-bottom: 32px;
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

.index-title {
  color: var(--color-header);
  text-align: center;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

.index-title h1 {
  font-size: 24px;
  margin: 0;
  padding: 0;
}

.index-title img {
  margin-right: 8px;
}
</style>
