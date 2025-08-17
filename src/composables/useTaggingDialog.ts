import { ref } from "vue"

export interface TaggingParams {
  entryId: string
  tagIds: string[]
}

const visible = ref(false)
const params = ref<TaggingParams | null>(null)

export function useTaggingDialog() {
  const openTaggingDialog = (p: TaggingParams) => {
    params.value = p
    visible.value = true
  }

  const closeTaggingDialog = () => {
    visible.value = false
    params.value = null
  }

  return {
    visible,
    params,
    openTaggingDialog,
    closeTaggingDialog,
  }
}
