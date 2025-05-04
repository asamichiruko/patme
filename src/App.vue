<script setup>
import { ref, computed } from "vue"
import { EntryModel } from "@/models/EntryModel.js"
import { TagModel } from "@/models/TagModel.js"
import { TaggingModel } from "@/models/TaggingModel.js"
import { LocalStorageAdapter } from "@/models/LocalStorageAdapter.js"
import InputAndListView from "@/components/InputAndListView.vue"
import SettingsForm from "@/components/SettingsView.vue"
import TabNavigation from "@/components/TabNavigation.vue"
import NotificationBar from "@/components/NotificationBar.vue"

const storage = new LocalStorageAdapter()
const entryModel = new EntryModel(storage)
const tagModel = new TagModel(storage)
const taggingModel = new TaggingModel(storage)

const tabs = [
  {
    key: "Home",
    label: "ホーム",
    component: InputAndListView,
    props: { entryModel, tagModel, taggingModel },
  },
  { key: "Settings", label: "設定", component: SettingsForm, props: { entryModel, tagModel } },
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
