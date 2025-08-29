<script setup lang="ts">
import { useTagStore } from "@/stores/useTagStore"
import { notify } from "@/utils/storageNotifier"
import { computed, ref } from "vue"
import LoadingSpinner from "../util/LoadingSpinner.vue"

const props = defineProps<{
  labeltext: string
}>()
const emit = defineEmits(["tag-created"])
const newTagTitle = ref("")
const tagStore = useTagStore()

const isVisibleLabel = computed(() => props.labeltext.trim() !== "")
const loading = ref(false)

const handleCreateTag = async () => {
  const trimmed = newTagTitle.value.trim()
  if (!trimmed) {
    return
  }

  try {
    loading.value = true
    let result = null
    const existing = await tagStore.getTagByTitle(trimmed)
    if (existing) {
      result = existing.id
    } else {
      result = await tagStore.createTag({ title: trimmed })
      notify()
    }
    if (!result) return

    emit("tag-created", result)
    newTagTitle.value = ""
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="tag-create-form">
    <label>
      <span class="new-tag-label" :class="{ 'visually-hidden': !isVisibleLabel }">{{
        props.labeltext || "タグ名"
      }}</span>
      <input
        class="new-tag-title"
        type="text"
        v-model="newTagTitle"
        @keydown.enter.prevent="handleCreateTag"
        placeholder="新しいタグ名"
      />
    </label>
    <button class="primary-button slim-button" type="button" @click="handleCreateTag">
      <LoadingSpinner v-if="loading" class="spinner" />
      <span class="button-label">追加</span>
    </button>
  </div>
</template>

<style scoped>
.tag-create-form {
  display: flex;
  align-items: center;
  gap: 8px;
}

.new-tag-label {
  display: inline-block;
  font-size: 15px;
  margin-right: 8px;
}
.new-tag-title {
  padding: 8px;
  font-size: 15px;
  width: 100px;
}

.slim-button {
  font-size: 15px;
  padding: 4px 12px;
}
</style>
