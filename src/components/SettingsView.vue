<script setup>
import { ref, onMounted } from "vue"
import TagManager from "@/components/TagManager.vue"
import ImportButton from "@/components/ImportButton.vue"
import ExportButton from "@/components/ExportButton.vue"

const props = defineProps({
  entryModel: Object,
  tagModel: Object,
})

const allTags = ref([])

const updateTags = (updated) => {
  props.tagModel.updateTags(updated)
  allTags.value = props.tagModel.getAllTags()
}

onMounted(() => {
  allTags.value = props.tagModel.getAllTags()
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
      <ExportButton :entry-model="entryModel" />
    </section>

    <section>
      <h2>インポート</h2>
      <p>
        保存した JSON
        ファイルをアップロードして記録をインポートします。差分の記録だけを追加し、既存の記録は上書きしません。
      </p>
      <ImportButton :entry-model="entryModel" />
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
