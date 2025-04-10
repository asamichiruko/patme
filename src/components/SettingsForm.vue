<script setup>
import { ref, useTemplateRef } from "vue"
import { useNotification } from "../composables/useNotification.js"

const props = defineProps({
  recordModel: Object,
})

const { trigger } = useNotification()
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

  trigger("データをエクスポートしました", "success")
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
    trigger(".json 形式のファイルを選択してください", "error")
    return
  }
  try {
    const jsonString = await file.text()
    const result = props.recordModel.importFromJsonString(jsonString)
    if (result) {
      trigger("データを復元しました", "success")
    } else {
      throw new Error("Import Failed Error")
    }
  } catch {
    trigger(
      `データの復元に失敗しました。選択したデータの内容を確認し、時間をおいて再度お試しください`,
      "error",
    )
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
    </section>

    <section>
      <p>
        保存した JSON
        ファイルをアップロードして記録を復元します。差分の記録だけを追加し、既存の記録は削除しません。
      </p>
      <button class="primary-button" @click="selectFile">ファイルをアップロードして復元する</button>
      <input ref="openfile" type="file" accept=".json" @change="importRecords" />
    </section>
  </div>
</template>

<style scoped>
input[type="file"] {
  display: none;
}
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
