<script setup lang="ts">
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import ConfirmDialog from "@/components/util/ConfirmDialog.vue"
import NotificationBar from "@/components/util/NotificationBar.vue"
import PromptDialog from "@/components/util/PromptDialog.vue"
import TabNavigation from "@/components/util/TabNavigation.vue"

import { LocalStorageAdapter } from "@/adapters/LocalStorageAdapter.js"
import { createServices } from "./utils/createServices"

import { useDataTransferStore } from "@/stores/useDataTransferStore.js"
import { useEntryStore } from "@/stores/useEntryStore.js"
import { useTagStore } from "@/stores/useTagStore.js"
import { useTaggingStore } from "@/stores/useTaggingStore.js"

const storage = new LocalStorageAdapter()

const services = createServices(storage)

const entryStore = useEntryStore()
entryStore.setService({ entryService: services.entryService })

const dataTransferStore = useDataTransferStore()
dataTransferStore.setService({
  importService: services.importService,
  exportService: services.exportService,
})

const tagStore = useTagStore()
tagStore.setService({ tagService: services.tagService })

const taggingStore = useTaggingStore()
taggingStore.setService({ taggingService: services.taggingService })
</script>

<template>
  <NotificationBar />
  <TabNavigation />
  <div class="container">
    <RouterView />
  </div>
  <PromptDialog />
  <TaggingDialog />
  <ConfirmDialog />
</template>
