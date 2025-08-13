<script setup lang="ts">
import { useNotificationBar } from "@/composables/useNotificationBar.js"
import { useDataTransferStore } from "@/stores/useDataTransferStore"
import { ref } from "vue"

const { trigger } = useNotificationBar()
const dataTransferStore = useDataTransferStore()
const fileInput = ref<HTMLInputElement | null>(null)

const importData = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) {
    return
  } else if (file.type !== "application/json") {
    trigger(".json 形式のファイルを選択してください", "error")
    return
  }
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    await dataTransferStore.restoreAll(data)
    trigger("データをリストアしました", "success")
  } catch (err) {
    trigger(
      `データのリストアに失敗しました。選択したデータの内容を確認し、時間をおいて再度お試しください`,
      "error",
    )
    console.error(err)
  }
}

const selectFile = () => {
  fileInput.value?.click()
}
</script>

<template>
  <form @submit.prevent="selectFile">
    <button type="submit" class="primary-button">記録をインポートする...</button>
    <input ref="fileInput" type="file" accept=".json" @change="importData" />
  </form>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
