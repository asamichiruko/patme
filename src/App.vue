<script setup>
import { ref } from "vue"

import MainView from "@/components/tab/MainView.vue"
import TabNavigation from "@/components/tab/TabNavigation.vue"
import NotificationBar from "@/components/util/NotificationBar.vue"
import PromptDialog from "@/components/util/PromptDialog.vue"
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import EntryFormAndListView from "@/components/tab/EntryFormAndListView.vue"
import SettingsView from "@/components/tab/SettingsView.vue"

import { LocalStorageAdapter } from "@/adapters/LocalStorageAdapter.js"
import { createServices } from "./utils/createServices"

import { useEntryStore } from "@/stores/useEntryStore.js"
import { useDataTransferStore } from "@/stores/useDataTransferStore.js"
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

const tabs = [
  {
    key: "Home",
    label: "ホーム",
    component: EntryFormAndListView,
    props: {},
  },
  {
    key: "Settings",
    label: "設定",
    component: SettingsView,
    props: {},
  },
]

const activeTab = ref("Home")
</script>

<template>
  <NotificationBar />
  <TabNavigation :tabs="tabs" v-model:active-tab="activeTab" />
  <MainView :tabs="tabs" :active-tab="activeTab" />
  <PromptDialog />
  <TaggingDialog />
</template>
