<script setup>
import { ref } from "vue"

const props = defineProps({
  recordModel: Object,
})

const exportMessage = ref("")
const importMessage = ref("")
const file = ref(null)

function onFileSelected(e) {
  file.value = e.target.files[0]
}

function exportRecords() {
  const jsonString = props.recordModel.exportAsJsonString()
  const blob = new Blob([jsonString], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  const dateString = new Date().toLocaleDateString("sv-SE")
  link.download = `records-${dateString}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  exportMessage.value = "データをダウンロードしました"
}

async function importRecords() {
  if (!file.value || file.value.type !== "application/json") {
    importMessage.value = ".json形式のファイルを選択してください"
    return
  }
  const jsonString = await file.value.text()
  const result = props.recordModel.importFromJsonString(jsonString)
  if (result) {
    importMessage.value = "データを復元しました"
  } else {
    importMessage.value = `データの復元に失敗しました。選択したデータの内容を確認し、時間をおいて再度お試しください`
  }
}
</script>

<template>
  <p>
    現在ブラウザにあるデータをJSON形式のファイルとしてダウンロードします。保存したファイルを使って後からデータを復元できます。
  </p>
  <p>
    <button @click="exportRecords">現在のデータをダウンロードする</button>
  </p>
  <p>{{ exportMessage }}</p>
  <p>
    保存したJSON形式のファイルをアップロードし、ブラウザにデータを復元します。いまブラウザに残っているデータは上書きせず、差分のデータだけを追加します。
  </p>
  <p><input type="file" @change="onFileSelected" accept=".json" /></p>
  <p>
    <button @click="importRecords">ファイルをアップロードして復元する</button>
  </p>
  <p>{{ importMessage }}</p>
</template>

<style scoped></style>
