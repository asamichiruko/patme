<script setup lang="ts">
import TagCreateInlineForm from "@/components/tag/TagCreateInlineForm.vue"
import TagOrderList from "@/components/tag/TagOrderList.vue"
import type { Tag } from "@/schemas/Tag"
import { useTagStore } from "@/stores/useTagStore"
import { subscribe } from "@/utils/storageNotifier"
import { nextTick, onMounted, ref, watch } from "vue"

const tagStore = useTagStore()
const latestTags = ref<Tag[]>([])
let isExternalUpdate = false
const tagOrderListRef = ref()

onMounted(async () => {
  await tagStore.fetchTags()
  const reload = () => {
    isExternalUpdate = true
    latestTags.value = tagStore.tags
  }
  subscribe(reload)
  reload()
})

watch(latestTags, (val) => {
  if (isExternalUpdate) {
    isExternalUpdate = false
    return
  }
  tagStore.reorderTags(val)
})

const handleTagCreated = async (tagId: string) => {
  await nextTick()
  tagOrderListRef.value?.scrollToTag(tagId)
}
</script>

<template>
  <form class="tag-manager">
    <h3>タグの追加</h3>
    <TagCreateInlineForm labeltext="" @tag-created="handleTagCreated" />
    <h3>並び替え</h3>
    <TagOrderList v-model:tags="latestTags" ref="tagOrderListRef" />
  </form>
</template>

<style scoped>
.tag-manager {
  max-width: 600px;
}
</style>
