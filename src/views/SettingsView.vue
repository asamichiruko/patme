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
      <h2>アカウント情報の編集</h2>
      <p>アカウント連携やパスワードの変更、アカウントの削除を行います。</p>
      <p>
        <a href="./account_settings" class="primary-button">アカウント情報の編集（別ページ）</a>
      </p>
    </section>

    <section>
      <h2>データの保存と復元</h2>
      <h3>エクスポート</h3>
      <p>
        記録を JSON ファイルとしてエクスポートします。
        エクスポートファイルは記録の復元に利用できます。
      </p>
      <ExportForm />
      <h3>インポート</h3>
      <p>
        アップロードしたファイルの内容で記録をリストアします。
        <strong>既存の記録を上書き</strong>します。
      </p>
      <ImportForm />
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
