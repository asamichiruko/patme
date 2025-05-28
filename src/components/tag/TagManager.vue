<script setup>
import { ref } from "vue"
import { useNotificationBar } from "@/composables/useNotificationBar.js"
import TagOrderList from "@/components/tag/TagOrderList.vue"
import { useTagStore } from "@/stores/useTagStore.js"

const { trigger } = useNotificationBar()
const tagStore = useTagStore()

const initialTags = ref([...tagStore.getTagsOrdered()])
const latestTags = ref([...initialTags.value])

const confirm = () => {
  latestTags.value.forEach((tag, idx) => (tag.order = idx + 1))
  tagStore.reorderTagByIds(latestTags.value.map((t) => t.id))
  trigger("タグの編集内容を保存しました", "success")
}

const discard = () => {
  initialTags.value = tagStore.getTagsOrdered()
  latestTags.value = initialTags.value
  trigger("タグの編集内容を破棄しました", "info")
}
</script>

<template>
  <form class="tag-manager" @submit.prevent="confirm">
    <TagOrderList v-model:tags="latestTags" />
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
