import type { EntryType } from "@/schemas/EntryType"
import { useDialog } from "./useDialog"

export interface EntryFormParams {
  action: "create" | "update"
  entryId?: string
  initialContent?: string
  initialEntryType?: EntryType
  initialReviewedCount?: number
  initialTagIds?: string[]
}

const { visible, params, openDialog, closeDialog } = useDialog<EntryFormParams>()

export function useEntryFormDialog() {
  return {
    visible,
    params,
    openEntryFormDialog: openDialog,
    closeEntryFormDialog: closeDialog,
  }
}
