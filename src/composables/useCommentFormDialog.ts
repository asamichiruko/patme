import type { EntryType } from "@/schemas/EntryType"
import { useDialog } from "./useDialog"

export interface CommentFormParams {
  action: "create" | "update"
  entryId: string
  commentId?: string
  initialContent?: string
  initialReviewType?: EntryType
}

const { visible, params, openDialog, closeDialog } = useDialog<CommentFormParams>()

export function useCommentFormDialog() {
  return {
    visible,
    params,
    openCommentFormDialog: openDialog,
    closeCommentFormDialog: closeDialog,
  }
}
