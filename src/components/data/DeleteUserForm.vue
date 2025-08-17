<script setup lang="ts">
import { useDeleteUserDialog } from "@/composables/useDeleteUserDialog"

const { openDeleteUserDialog } = useDeleteUserDialog()

function handleDeleteUser() {
  openDeleteUserDialog()
}
</script>

<template>
  <form @submit.prevent="handleDeleteUser">
    <button type="submit" class="warning-button">ユーザを削除する</button>
  </form>
</template>
