<script setup>
import { LocalStorageAdapter } from "@/adapters/LocalStorageAdapter.js"

import { EntryRepository } from "@/repositories/EntryRepository.js"
import { TagRepository } from "@/repositories/TagRepository.js"
import { TaggingRepository } from "@/repositories/TaggingRepository.js"

import { EntryService } from "@/services/EntryService.js"
import { TagService } from "@/services/TagService.js"
import { TaggingService } from "@/services/TaggingService.js"
import { ImportService } from "@/services/ImportService.js"
import { ExportService } from "@/services/ExportService.js"

import { EntryModel } from "@/models/EntryModel.js"
import { TaggingModel } from "@/models/TaggingModel.js"
import { TagModel } from "@/models/TagModel.js"
import { ImportModel } from "@/models/ImportModel.js"
import { ExportModel } from "@/models/ExportModel.js"

import EntryFormAndListView from "@/components/tab/EntryFormAndListView.vue"
import SettingsView from "@/components/tab/SettingsView.vue"

import MainView from "@/components/tab/MainView.vue"
import TabNavigation from "@/components/tab/TabNavigation.vue"
import NotificationBar from "@/components/util/NotificationBar.vue"
import { ref } from "vue"

const storage = new LocalStorageAdapter()

const entryRepository = new EntryRepository(storage)
const tagRepository = new TagRepository(storage)
const taggingRepository = new TaggingRepository(storage)

const entryService = new EntryService({ entryRepository, tagRepository, taggingRepository })
const tagService = new TagService({ tagRepository })
const taggingService = new TaggingService({ entryRepository, tagRepository, taggingRepository })
const importService = new ImportService({ tagService, taggingService, entryService })
const exportService = new ExportService({ tagService, taggingService, entryService })

const taggingModel = new TaggingModel({ taggingService, tagService })
const tagModel = new TagModel(tagService)
const entryModel = new EntryModel(entryService)
const importModel = new ImportModel(importService)
const exportModel = new ExportModel(exportService)

const tabs = [
  {
    key: "Home",
    label: "ホーム",
    component: EntryFormAndListView,
    props: { entryModel, tagModel, taggingModel },
  },
  {
    key: "Settings",
    label: "設定",
    component: SettingsView,
    props: { entryModel, tagModel, importModel, exportModel },
  },
]

const activeTab = ref("Home")
</script>

<template>
  <NotificationBar />
  <TabNavigation :tabs="tabs" v-model:active-tab="activeTab" />
  <MainView :tabs="tabs" :active-tab="activeTab" />
</template>
