<script setup>
import { ref, onMounted } from "vue"
import { subscribe } from "@/utils/storageNotifier.js"
import TagManager from "@/components/TagManager.vue"
import ImportForm from "@/components/ImportForm.vue"
import ExportForm from "@/components/ExportForm.vue"

const props = defineProps({
  entryModel: Object,
  tagModel: Object,
  importModel: Object,
  exportModel: Object,
})

const allTags = ref([])

const updateTags = (updated) => {
  props.tagModel.reorderTagByIds(updated.map((t) => t.id))
  allTags.value = props.tagModel.getTagsOrdered()
}

onMounted(() => {
  const reload = () => {
    allTags.value = props.tagModel.getTagsOrdered()
  }
  subscribe(reload)
  reload()
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
