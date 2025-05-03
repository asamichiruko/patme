<script setup>
import { ref } from "vue"
import { useNotification } from "@/composables/useNotification.js"

const props = defineProps({
  entryModel: Object,
})

const { trigger } = useNotification()
const fileInput = ref(null)

const importEntries = async (e) => {
  const file = e.target.files[0]
  if (!file) {
    return
  } else if (file.type !== "application/json") {
    trigger(".json 形式のファイルを選択してください", "error")
    return
  }
  try {
    const jsonString = await file.text()
    const json = JSON.parse(jsonString)
    props.entryModel.importFromJson(json)

    trigger("データを復元しました", "success")
  } catch {
    trigger(
      `データの復元に失敗しました。選択したデータの内容を確認し、時間をおいて再度お試しください`,
      "error",
    )
  }
}

const selectFile = () => {
  fileInput.value?.click()
}
</script>

<template>
  <form @submit.prevent="selectFile">
    <button type="submit" class="primary-button">記録をインポートする...</button>
    <input
      ref="fileInput"
      type="file"
      data-testid="import-file"
      accept=".json"
      @change="importEntries"
    />
  </form>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
