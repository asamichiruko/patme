<script setup lang="ts">
import DeleteUserForm from "@/components/data/DeleteUserForm.vue"
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
      <h2>データの保存と復元</h2>
      <h3>エクスポート</h3>
      <ExportForm />
      <p>
        記録を JSON ファイルとしてエクスポートします。
        エクスポートファイルは記録の復元に利用できます。
      </p>
      <h3>インポート</h3>
      <ImportForm />
      <p>
        アップロードしたファイルの内容で記録をリストアします。
        <strong>既存の記録を上書き</strong>します。
      </p>
    </section>

    <section>
      <h2>ユーザの削除</h2>
      <DeleteUserForm />
      <p>
        匿名または連携アカウントの情報を削除します。
        <strong>この操作は元に戻せません</strong>。
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
</style>
