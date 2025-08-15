<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import AddCommentDialog from "@/components/entry/AddCommentDialog.vue"
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import ConfirmDialog from "@/components/util/ConfirmDialog.vue"
import NotificationBar from "@/components/util/NotificationBar.vue"
import TabNavigation from "@/components/util/TabNavigation.vue"
import { auth } from "@/firebase"
import { useEntryStore } from "@/stores/useEntryStore"
import { useTagStore } from "@/stores/useTagStore"
import {
  GoogleAuthProvider,
  linkWithRedirect,
  onAuthStateChanged,
  signOut,
  type Unsubscribe,
} from "firebase/auth"
import { onMounted, onUnmounted, ref } from "vue"
import { RouterView, useRouter } from "vue-router"

const entryStore = useEntryStore()
const tagStore = useTagStore()
const router = useRouter()

const isAnonymous = ref(false)

let unsubscribe: Unsubscribe

onMounted(async () => {
  unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      isAnonymous.value = user.isAnonymous
    } else {
      isAnonymous.value = false
    }
  })

  await Promise.all([entryStore.fetchEntriesWithRelations(), tagStore.fetchTags()])
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

const logout = async () => {
  try {
    await signOut(auth)
    router.push("/login")
  } catch (err) {
    console.error("Logout error", err)
  }
}

const linkWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const user = auth.currentUser
  if (!user) return
  try {
    await linkWithRedirect(user, provider)
  } catch (err) {
    console.error("Failed to link with google account", err)
  }
}
</script>

<template>
  <header>
    <div class="index-title">
      <h1><img :src="patmeImg" alt="" width="20px" height="20px" />ふりかえり帖</h1>
    </div>
    <div class="account-nav">
      <div v-if="isAnonymous">
        <button class="link-button" @click="linkWithGoogle">Google 連携</button>
      </div>
      <div v-else>
        <button class="logout-button" @click="logout">ログアウト</button>
      </div>
    </div>
  </header>
  <NotificationBar />
  <TabNavigation />
  <div class="container">
    <RouterView />
  </div>
  <AddCommentDialog />
  <TaggingDialog />
  <ConfirmDialog />
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

.link-button {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s;
}
.link-button:hover {
  background-color: var(--color-primary-hover);
}
.link-button:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
  border-radius: 4px;
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
