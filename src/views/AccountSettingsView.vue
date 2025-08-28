<script setup lang="ts">
import ChangePasswordForm from "@/components/data/ChangePasswordForm.vue"
import DeleteUserForm from "@/components/data/DeleteUserForm.vue"
import EnablePasswordAuthForm from "@/components/data/EnablePasswordAuthForm.vue"
import ProviderLinkManager from "@/components/data/ProviderLinkManager.vue"
import PageHeader from "@/components/util/PageHeader.vue"
import { useAuthStore } from "@/stores/useAuthStore"
import { computed } from "vue"

const authStore = useAuthStore()

const isPasswordLinked = computed(() => authStore.providers.includes("password"))
</script>

<template>
  <PageHeader :show-account-nav="true" :logo-href="'./main'" />
  <div class="container">
    <section>
      <p><a href="./settings">設定画面へ戻る</a></p>
    </section>
    <section>
      <h2>パスワード認証の追加</h2>
      <EnablePasswordAuthForm />
    </section>
    <section v-if="isPasswordLinked">
      <h2>パスワードの更新</h2>
      <ChangePasswordForm />
    </section>
    <section>
      <h2>認証方法の管理</h2>
      <ProviderLinkManager />
    </section>
    <section>
      <h2>ユーザアカウントの削除</h2>
      <DeleteUserForm />
    </section>
  </div>
</template>
