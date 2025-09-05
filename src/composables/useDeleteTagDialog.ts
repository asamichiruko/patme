import { useDialog } from "@/composables/useDialog"

export interface DeleteTagDialogParams {
  tagId: string
  tagTitle: string
}

const { visible, params, openDialog, closeDialog } = useDialog<DeleteTagDialogParams>()

export function useDeleteTagDialog() {
  return {
    visible,
    params,
    openDeleteTagDialog: openDialog,
    closeDeleteTagDialog: closeDialog,
  }
}
