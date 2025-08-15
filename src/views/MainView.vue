<script setup lang="ts">
import AddCommentDialog from "@/components/entry/AddCommentDialog.vue"
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import ConfirmDialog from "@/components/util/ConfirmDialog.vue"
import NotificationBar from "@/components/util/NotificationBar.vue"
import TabNavigation from "@/components/util/TabNavigation.vue"
import { auth } from "@/firebase"
import { useEntryStore } from "@/stores/useEntryStore"
import { useTagStore } from "@/stores/useTagStore"
import { signOut } from "firebase/auth"
import { onMounted } from "vue"
import { RouterView, useRouter } from "vue-router"

const entryStore = useEntryStore()
const tagStore = useTagStore()

onMounted(async () => {
  await Promise.all([entryStore.fetchEntriesWithRelations(), tagStore.fetchTags()])
})

const router = useRouter()

const logout = async () => {
  try {
    await signOut(auth)
    router.push("/login")
  } catch (err) {
    console.error("Logout error", err)
  }
}
</script>

<template>
  <NotificationBar />
  <p><button @click="logout">ログアウト</button></p>
  <TabNavigation />
  <div class="container">
    <RouterView />
  </div>
  <AddCommentDialog />
  <TaggingDialog />
  <ConfirmDialog />
</template>
