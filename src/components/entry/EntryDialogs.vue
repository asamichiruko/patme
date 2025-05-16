<script setup>
import PromptDialog from "@/components/util/PromptDialog.vue"
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import { ref, watch } from "vue"

const props = defineProps({
  showingDialog: String,
  entry: Object,
  allTags: Array,
})
const emit = defineEmits(["add-star", "update-taggings", "add-tag", "close"])

const showPrompt = ref(false)
const showTagging = ref(false)
const initialTagIds = ref(null)

const taggingDialogRef = ref(null)

const selectTagById = (id) => {
  taggingDialogRef?.value.selectTagById(id)
}

const addStar = (content) => {
  emit("add-star", content)
}

const updateTaggings = (taggings) => {
  emit("update-taggings", taggings)
}

const addTag = (title) => {
  emit("add-tag", title)
}

const closeDialog = () => {
  emit("close")
}

watch(
  () => props.entry,
  (val) => {
    if (val) {
      initialTagIds.value = val.tags.map((t) => t.id)
    } else {
      initialTagIds.value = null
    }
  },
)

watch(
  () => props.showingDialog,
  (val) => {
    if (val === "comment") {
      showPrompt.value = true
      showTagging.value = false
    } else if (val === "tagging") {
      showPrompt.value = false
      showTagging.value = true
    } else {
      showPrompt.value = false
      showTagging.value = false
    }
  },
)

defineExpose({
  selectTagById,
})
</script>

<template>
  <PromptDialog
    @update:show="showPrompt = $event"
    @submit="addStar"
    @cancel="closeDialog"
    :show="showPrompt"
    :message="'振り返り'"
    :submittext="'記録する'"
    :canceltext="'キャンセル'"
    :placeholder="'どんな点がよかったですか？'"
  />

  <TaggingDialog
    ref="taggingDialogRef"
    @update:show="showTagging = $event"
    @submit="updateTaggings"
    @cancel="closeDialog"
    @add-tag="addTag"
    :show="showTagging"
    :initial-tag-ids="initialTagIds"
    :all-tags="props.allTags"
  />
</template>
