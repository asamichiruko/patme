<script setup>
import { ref, computed } from "vue"

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

import InputAndListView from "@/components/InputAndListView.vue"
import SettingsView from "@/components/SettingsView.vue"
import TabNavigation from "@/components/TabNavigation.vue"
import NotificationBar from "@/components/NotificationBar.vue"

const storage = new LocalStorageAdapter()

const entryRepository = new EntryRepository(storage)
const tagRepository = new TagRepository(storage)
const taggingRepository = new TaggingRepository(storage)

const entryService = new EntryService({ entryRepository, tagRepository, taggingRepository })
const tagService = new TagService({ tagRepository, taggingRepository })
const taggingService = new TaggingService({ taggingRepository, tagRepository })
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
    component: InputAndListView,
    props: { entryModel, tagModel, taggingModel },
  },
  {
    key: "Settings",
    label: "設定",
    component: SettingsView,
    props: { entryModel, tagModel, importModel, exportModel },
  },
]
const currentTabKey = ref("Home")

const currentTab = computed(() => {
  const activeTab = tabs.find((tab) => tab.key === currentTabKey.value)
  if (activeTab) {
    return activeTab
  } else {
    return tabs[0]
  }
})
</script>

<template>
  <NotificationBar />
  <TabNavigation :tabs="tabs" v-model:current-tab="currentTabKey" />

  <div class="tab-content">
    <div class="container">
      <keep-alive>
        <component :is="currentTab.component" v-bind="currentTab.props" />
      </keep-alive>
    </div>
  </div>
</template>
