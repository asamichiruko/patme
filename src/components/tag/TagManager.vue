<script setup>
import { nextTick, onMounted, ref, watch } from "vue"
import TagOrderList from "@/components/tag/TagOrderList.vue"
import { useTagStore } from "@/stores/useTagStore.js"
import TagCreateInlineForm from "@/components/tag/TagCreateInlineForm.vue"
import { subscribe } from "@/utils/storageNotifier"

const tagStore = useTagStore()
const latestTags = ref([...tagStore.getTagsOrdered()])
let isExternalUpdate = false
const tagOrderListRef = ref()

onMounted(() => {
  const reload = () => {
    isExternalUpdate = true
    latestTags.value = tagStore.getTagsOrdered()
  }

  subscribe(reload)
})

watch(latestTags, (val) => {
  if (isExternalUpdate) {
    isExternalUpdate = false
    return
  }
  tagStore.reorderTagByIds(val.map((t) => t.id))
})

const handleTagCreated = async (tag) => {
  await nextTick()
  tagOrderListRef.value?.scrollToTag(tag.id)
}
</script>

<template>
  <form class="tag-manager">
    <h3>タグの追加</h3>
    <TagCreateInlineForm @tag-created="handleTagCreated" />
    <h3>並び替え</h3>
    <TagOrderList v-model:tags="latestTags" ref="tagOrderListRef" />
  </form>
</template>

<style scoped>
.tag-manager {
  max-width: 600px;
}
</style>
