import { useDialog } from "@/composables/useDialog"

export type DeleteCommentDialogParams = {
  id: string
}

const { visible, params, openDialog, closeDialog } = useDialog<DeleteCommentDialogParams>()

export function useDeleteCommentDialog() {
  return {
    visible,
    params,
    openDeleteCommentDialog: openDialog,
    closeDeleteCommentDialog: closeDialog,
  }
}
