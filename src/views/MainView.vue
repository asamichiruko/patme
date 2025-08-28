<script setup lang="ts">
import AddCommentDialog from "@/components/entry/AddCommentDialog.vue"
import DeleteTagDialog from "@/components/tag/DeleteTagDialog.vue"
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import PageHeader from "@/components/util/PageHeader.vue"
import TabNavigation from "@/components/util/TabNavigation.vue"
import { RouterView } from "vue-router"
</script>

<template>
  <PageHeader :show-account-nav="true" :logoTo="'/main'" />
  <TabNavigation />
  <div class="container">
    <RouterView />
  </div>
  <AddCommentDialog />
  <TaggingDialog />
  <DeleteTagDialog />
</template>
