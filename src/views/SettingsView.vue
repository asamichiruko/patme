<script setup lang="ts">
import ExportForm from "@/components/data/ExportForm.vue"
import ImportForm from "@/components/data/ImportForm.vue"
import TagManager from "@/components/tag/TagManager.vue"
</script>

<template>
  <div class="settings-form">
    <section>
      <h2>タグの編集</h2>
      <TagManager />
    </section>

    <section>
      <h2>エクスポート</h2>
      <ExportForm />
      <p>
        記録を JSON
        ファイルとしてエクスポートします。エクスポートファイルは記録の復元に利用できます。
      </p>
    </section>

    <section>
      <h2>インポート</h2>
      <ImportForm />
      <p>
        保存した JSON
        アップロードしたファイルの内容で記録をリストアします。<strong>既存の記録を上書き</strong>します。
      </p>
    </section>
  </div>
</template>

<style scoped>
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h2 {
  color: var(--color-header);
}
</style>
