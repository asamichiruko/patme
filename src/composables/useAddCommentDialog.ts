import type { EntryType } from "@/schemas/EntryType"
import { useDialog } from "./useDialog"

export interface AddCommentParams {
  entryId: string
  entryType: EntryType
}

const { visible, params, openDialog, closeDialog } = useDialog<AddCommentParams>()

export function useAddCommentDialog() {
  return {
    visible,
    params,
    openAddCommentDialog: openDialog,
    closeAddCommentDialog: closeDialog,
  }
}
