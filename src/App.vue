<script setup>
import { ref, computed } from "vue"

import { LocalStorageAdapter } from "@/models/LocalStorageAdapter.js"

import { TagRepository } from "@/repositories/TagRepository.js"
import { TaggingRepository } from "@/repositories/TaggingRepository.js"

import { TagService } from "@/services/TagService.js"

import { TaggingModel } from "@/models/TaggingModel.js"
import { TagModel } from "@/models/TagModel.js"
import { EntryModel } from "@/models/EntryModel.js"

import InputAndListView from "@/components/InputAndListView.vue"
import SettingsView from "@/components/SettingsView.vue"
import TabNavigation from "@/components/TabNavigation.vue"
import NotificationBar from "@/components/NotificationBar.vue"

const storage = new LocalStorageAdapter()

const tagRepos = new TagRepository(storage)
const taggingRepos = new TaggingRepository(storage)

const tagService = new TagService(tagRepos, taggingRepos)

const taggingModel = new TaggingModel(taggingRepos, tagRepos)
const tagModel = new TagModel(tagService)
const entryModel = new EntryModel(storage, tagService)

const tabs = [
  {
    key: "Home",
    label: "ホーム",
    component: InputAndListView,
    props: { entryModel, tagModel, taggingModel },
  },
  { key: "Settings", label: "設定", component: SettingsView, props: { entryModel, tagModel } },
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
