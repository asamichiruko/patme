<script setup>
import { ref, useTemplateRef } from "vue"

const props = defineProps({
  recordModel: Object,
})

const exportMessage = ref("")
const importMessage = ref("")
const fileInput = useTemplateRef("openfile")

const exportRecords = () => {
  const jsonString = props.recordModel.exportAsJsonString()
  const blob = new Blob([jsonString], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const dateString = new Date().toLocaleDateString("sv-SE")

  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: `records-${dateString}.json`,
  })
  a.click()
  URL.revokeObjectURL(url)

  exportMessage.value = "データをダウンロードしました"
}

const selectFile = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const importRecords = async (e) => {
  const file = e.target.files[0]
  if (!file) {
    return
  }
  if (file.type !== "application/json") {
    importMessage.value = ".json形式のファイルを選択してください"
    return
  }
  try {
    const jsonString = await file.text()
    const result = props.recordModel.importFromJsonString(jsonString)
    if (result) {
      importMessage.value = "データを復元しました"
    } else {
      throw new Error("Import Failed Error")
    }
  } catch {
    importMessage.value = `データの復元に失敗しました。選択したデータの内容を確認し、時間をおいて再度お試しください`
  }
}
</script>

<template>
  <div class="settings-form">
    <section>
      <p>
        記録を JSON
        ファイルとしてエクスポートします。エクスポートファイルは記録の復元に利用できます。
      </p>
      <p>
        <button class="primary-button" @click="exportRecords">データをエクスポートする</button>
      </p>
      <p>{{ exportMessage }}</p>
    </section>

    <section>
      <p>
        保存した JSON
        ファイルをアップロードして記録を復元します。差分の記録だけを追加し、既存の記録は削除しません。
      </p>
      <button class="primary-button" @click="selectFile">ファイルをアップロードして復元する</button>
      <input ref="openfile" type="file" accept=".json" @change="importRecords" />
      <p>{{ importMessage }}</p>
    </section>
  </div>
</template>

<style scoped>
input[type="file"] {
  display: none;
}

section {
  margin-bottom: 40px;
}
</style>
