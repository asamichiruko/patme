<script setup lang="ts">
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import AddCommentDialog from "@/components/util/AddCommentDialog.vue"
import ConfirmDialog from "@/components/util/ConfirmDialog.vue"
import NotificationBar from "@/components/util/NotificationBar.vue"
import TabNavigation from "@/components/util/TabNavigation.vue"
import { onMounted } from "vue"
import { useEntryStore } from "./stores/useEntryStore"
import { useTagStore } from "./stores/useTagStore"

const entryStore = useEntryStore()
const tagStore = useTagStore()

onMounted(async () => {
  await Promise.all([entryStore.fetchEntriesWithRelations(), tagStore.fetchTags()])
})
</script>

<template>
  <NotificationBar />
  <TabNavigation />
  <div class="container">
    <RouterView />
  </div>
  <AddCommentDialog />
  <TaggingDialog />
  <ConfirmDialog />
</template>
