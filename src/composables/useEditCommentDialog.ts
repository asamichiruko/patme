import type { EntryType } from "@/schemas/EntryType"
import { useDialog } from "./useDialog"

export interface EditCommentParams {
  entryId: string
  entryType: EntryType
  commentId: string
  oldContent: string
  oldReviewType: EntryType | null
}

const { visible, params, openDialog, closeDialog } = useDialog<EditCommentParams>()

export function useEditCommentDialog() {
  return {
    visible,
    params,
    openEditCommentDialog: openDialog,
    closeEditCommentDialog: closeDialog,
  }
}
