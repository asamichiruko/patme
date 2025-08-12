<script setup lang="ts">
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import ConfirmDialog from "@/components/util/ConfirmDialog.vue"
import NotificationBar from "@/components/util/NotificationBar.vue"
import PromptDialog from "@/components/util/PromptDialog.vue"
import TabNavigation from "@/components/util/TabNavigation.vue"
</script>

<template>
  <NotificationBar />
  <TabNavigation />
  <div class="container">
    <RouterView />
  </div>
  <PromptDialog />
  <TaggingDialog />
  <ConfirmDialog />
</template>
