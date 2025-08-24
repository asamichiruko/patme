<script setup lang="ts">
import patmeImg from "@/assets/patme.svg"
import EnablePasswordAuthForm from "@/components/data/EnablePasswordAuthForm.vue"
</script>

<template>
  <header class="main-header">
    <div class="main-title">
      <h1><img :src="patmeImg" alt="" width="20px" height="20px" />ふりかえり帖</h1>
    </div>
  </header>

  <div class="container">
    <section>
      <p><a href="./settings">設定画面へ戻る</a></p>
    </section>
    <section>
      <h2>パスワード認証の追加</h2>
      <EnablePasswordAuthForm />
    </section>
    <section>
      <h2>プロバイダ連携の管理</h2>
    </section>
    <section>
      <h2>パスワードの再設定</h2>
    </section>
    <section>
      <h2>ユーザアカウントの削除</h2>
    </section>
  </div>
</template>

<style scoped></style>
