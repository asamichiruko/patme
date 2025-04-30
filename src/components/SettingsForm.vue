<script setup>
import { useTemplateRef } from "vue"
import { useNotification } from "@/composables/useNotification.js"
import TagManager from "@/components/TagManager.vue"

const props = defineProps({
  entryModel: Object,
})

const { trigger } = useNotification()
const fileInput = useTemplateRef("openfile")

const exportEntries = () => {
  const json = props.entryModel.exportAsJson()
  const blob = new Blob([JSON.stringify(json)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const dateString = new Date().toLocaleDateString("sv-SE")
  const a = document.createElement("a")
  a.href = url
  a.download = `entries-${dateString}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  trigger("データをエクスポートしました", "success")
}

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
  <div class="settings-form">
    <section>
      <h2>タグの編集</h2>
      <TagManager :all-tags="props.entryModel.getAllTags()" />
    </section>

    <section>
      <h2>エクスポート</h2>
      <p>
        記録を JSON
        ファイルとしてエクスポートします。エクスポートファイルは記録の復元に利用できます。
      </p>
      <p>
        <button class="primary-button" data-testid="export-button" @click="exportEntries">
          記録をエクスポートする
        </button>
      </p>
    </section>

    <section>
      <h2>インポート</h2>
      <p>
        保存した JSON
        ファイルをアップロードして記録をインポートします。差分の記録だけを追加し、既存の記録は上書きしません。
      </p>
      <button class="primary-button" data-testid="import-button" @click="selectFile">
        記録をインポートする...
      </button>
      <input
        ref="openfile"
        type="file"
        data-testid="import-file"
        accept=".json"
        @change="importEntries"
      />
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
  gap: 16px;
}
</style>
