<script setup lang="ts">
import TagCreateInlineForm from "@/components/tag/TagCreateInlineForm.vue"
import TagOrderList from "@/components/tag/TagOrderList.vue"
import { nextTick, ref } from "vue"

const tagOrderListRef = ref()

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
    <TagOrderList ref="tagOrderListRef" />
  </form>
</template>

<style scoped>
.tag-manager {
  max-width: 600px;
}

h3 {
  color: var(--color-header);
}
</style>
