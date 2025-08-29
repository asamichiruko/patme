<script setup lang="ts">
import { useNotificationBar } from "@/composables/useNotificationBar.js"
import { useDataTransferStore } from "@/stores/useDataTransferStore"
import { ref } from "vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const { trigger } = useNotificationBar()
const dataTransferStore = useDataTransferStore()

const loading = ref(false)

const filenameFromDate = () => {
  const dateString = new Date().toLocaleDateString("sv-SE")
  return `entries-${dateString}.json`
}

const exportData = async () => {
  if (loading.value) return
  try {
    loading.value = true
    const exported = await dataTransferStore.exportAll()
    if (!exported) {
      trigger("データのエクスポートに失敗しました。時間をおいて再度お試しください")
      return
    }
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filenameFromDate()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    trigger("データをエクスポートしました", "success")
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="exportData">
    <button type="submit" class="primary-button">
      <LoadingSpinner v-if="loading" /><span class="button-label">記録をエクスポートする</span>
    </button>
  </form>
</template>
