<script setup>
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import { ref, watch } from "vue"

const props = defineProps({
  showingDialog: String,
  entry: Object,
  allTags: Array,
})
const emit = defineEmits(["update-taggings", "add-tag", "close"])

const showTagging = ref(false)
const initialTagIds = ref(null)
const taggingDialogRef = ref(null)

const selectTagById = (id) => {
  taggingDialogRef?.value.selectTagById(id)
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
    if (val === "tagging") {
      showTagging.value = true
    } else {
      showTagging.value = false
    }
  },
)

defineExpose({
  selectTagById,
})
</script>

<template>
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
