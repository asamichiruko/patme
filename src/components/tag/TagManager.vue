<script setup lang="ts">
import TagCreateInlineForm from "@/components/tag/TagCreateInlineForm.vue"
import TagOrderList from "@/components/tag/TagOrderList.vue"
import type { Tag } from "@/schemas/Tag"
import { useTagStore } from "@/stores/useTagStore"
import { notify, subscribe } from "@/utils/storageNotifier"
import { nextTick, onMounted, ref, watch } from "vue"

const tagStore = useTagStore()
const latestTags = ref<Tag[]>([])
const tagOrderListRef = ref()

const reload = async () => {
  await tagStore.fetchTags()
}

onMounted(async () => {
  subscribe(reload)
  reload()
})

watch(latestTags, (val) => {
  tagStore.reorderTags(val)
})

const handleTagCreated = async (tagId: string) => {
  notify()
  await nextTick()
  tagOrderListRef.value?.scrollToTag(tagId)
}
</script>

<template>
  <form class="tag-manager">
    <h3>タグの追加</h3>
    <TagCreateInlineForm labeltext="" @tag-created="handleTagCreated" />
    <h3>並び替え</h3>
    <TagOrderList v-model:tags="tagStore.tags" ref="tagOrderListRef" />
  </form>
</template>

<style scoped>
.tag-manager {
  max-width: 600px;
}
</style>
