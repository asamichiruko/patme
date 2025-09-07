import { useDialog } from "@/composables/useDialog"

export type DeleteCommentDialogParams = {
  commentId: string
  entryId: string
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
