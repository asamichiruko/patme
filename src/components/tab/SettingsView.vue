<script setup>
import TagManager from "@/components/tag/TagManager.vue"
import ImportForm from "@/components/data/ImportForm.vue"
import ExportForm from "@/components/data/ExportForm.vue"

const props = defineProps({
  importModel: Object,
  exportModel: Object,
})
</script>

<template>
  <div class="settings-form">
    <section>
      <h2>タグの編集</h2>
      <TagManager :all-tags="allTags" @save="updateTags" />
    </section>

    <section>
      <h2>エクスポート</h2>
      <p>
        記録を JSON
        ファイルとしてエクスポートします。エクスポートファイルは記録の復元に利用できます。
      </p>
      <ExportForm :export-model="props.exportModel" />
    </section>

    <section>
      <h2>インポート</h2>
      <p>
        保存した JSON
        ファイルをアップロードして記録をインポートします。差分の記録だけを追加し、既存の記録は上書きしません。
      </p>
      <ImportForm :import-model="props.importModel" />
    </section>
  </div>
</template>

<style scoped>
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
