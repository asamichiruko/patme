<script setup>
import { inject, ref } from "vue"
import { useNotification } from "@/composables/useNotification.js"
import TagOrderList from "@/components/tag/TagOrderList.vue"

const { trigger } = useNotification()
const tagStore = inject("tagStore")

const latestTags = ref([...tagStore.allTags.value])
const TagOrderListRef = ref(null)

const onUpdateTags = (updated) => {
  latestTags.value = updated
}

const confirm = () => {
  latestTags.value.forEach((tag, idx) => (tag.order = idx + 1))
  tagStore.reorderTagByIds(latestTags.value.map((t) => t.id))
  trigger("タグの編集内容を保存しました", "success")
}

const discard = () => {
  TagOrderListRef.value.resetOrder()
  latestTags.value = tagStore.allTags.value
  trigger("タグの編集内容を破棄しました", "info")
}
</script>

<template>
  <form class="tag-manager" @submit.prevent="confirm">
    <TagOrderList ref="TagOrderListRef" :initial-tags="latestTags" @update="onUpdateTags" />
    <div class="tag-edit-actions">
      <button type="button" class="cancel-button" @click="discard">キャンセル</button>
      <button type="submit" class="primary-button">保存</button>
    </div>
  </form>
</template>

<style scoped>
.tag-manager {
  max-width: 600px;
}

.tag-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
</style>
