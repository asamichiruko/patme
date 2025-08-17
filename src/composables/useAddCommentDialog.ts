import type { EntryType } from "@/schemas/EntryType"
import { ref } from "vue"

export interface AddCommentParams {
  entryId: string
  entryType: EntryType
}

const visible = ref(false)
const params = ref<AddCommentParams | null>(null)

export function useAddCommentDialog() {
  const openAddCommentDialog = (p: AddCommentParams) => {
    params.value = p
    visible.value = true
  }

  const closeAddCommentDialog = () => {
    visible.value = false
    params.value = null
  }

  return {
    visible,
    params,
    openAddCommentDialog,
    closeAddCommentDialog,
  }
}
