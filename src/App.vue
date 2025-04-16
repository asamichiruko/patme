<script setup>
import { ref, computed } from "vue"
import { RecordModel } from "./models/RecordModel.js"
import { LocalStorageAdapter } from "./models/LocalStorageAdapter.js"
import InputForm from "./components/InputForm.vue"
import RecordList from "./components/RecordList.vue"
import SettingsForm from "./components/SettingsForm.vue"
import TabNavigation from "./components/TabNavigation.vue"
import NotificationBar from "./components/NotificationBar.vue"

const props = defineProps({
  recordModel: { type: Object, required: false },
})

const recordModel = props.recordModel ?? new RecordModel(new LocalStorageAdapter())

const tabs = [
  { key: "Input", label: "入力", component: InputForm },
  { key: "Records", label: "リスト", component: RecordList },
  { key: "Settings", label: "設定", component: SettingsForm },
]
const currentTabKey = ref("Input")

const currentTabContent = computed(() => {
  const activeTab = tabs.find((tab) => tab.key === currentTabKey.value)
  if (activeTab.component) {
    return activeTab.component
  } else {
    return InputForm
  }
})
</script>

<template>
  <NotificationBar />
  <TabNavigation :tabs="tabs" v-model:currentTab="currentTabKey" />

  <div class="tab-content">
    <div class="container">
      <keep-alive>
        <component :is="currentTabContent" :record-model="recordModel" />
      </keep-alive>
    </div>
  </div>
</template>

<style scoped></style>
