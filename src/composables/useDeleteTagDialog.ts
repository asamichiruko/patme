import { ref } from "vue"

export interface DeleteTagDialogParams {
  tagId: string
  tagTitle: string
}

const visible = ref(false)
const params = ref<DeleteTagDialogParams | null>(null)

export function useDeleteTagDialog() {
  const openDeleteTagDialog = (p: DeleteTagDialogParams) => {
    params.value = p
    visible.value = true
  }

  const closeDeleteTagDialog = () => {
    visible.value = false
    params.value = null
  }

  return {
    visible,
    params,
    openDeleteTagDialog,
    closeDeleteTagDialog,
  }
}
