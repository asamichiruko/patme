<script setup lang="ts">
import CommentFormDialog from "@/components/entry/CommentFormDialog.vue"
import DeleteCommentDialog from "@/components/entry/DeleteCommentDialog.vue"
import DeleteEntryDialog from "@/components/entry/DeleteEntryDialog.vue"
import EntryFormDialog from "@/components/entry/EntryFormDialog.vue"
import DeleteTagDialog from "@/components/tag/DeleteTagDialog.vue"
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import PageHeader from "@/components/util/PageHeader.vue"
import TabNavigation from "@/components/util/TabNavigation.vue"
import { useEntryStore } from "@/stores/useEntryStore"
import { subscribe } from "@/utils/storageNotifier"
import { onMounted } from "vue"
import { RouterView } from "vue-router"

const entryStore = useEntryStore()

onMounted(async () => {
  subscribe(async () => {
    await entryStore.fetchEntriesWithRelations()
  })
})
</script>

<template>
  <PageHeader :show-account-nav="true" :logoTo="'/main'" />
  <TabNavigation />
  <div class="container">
    <RouterView />
  </div>
  <CommentFormDialog />
  <EntryFormDialog />
  <TaggingDialog />
  <DeleteTagDialog />
  <DeleteEntryDialog />
  <DeleteCommentDialog />
</template>
