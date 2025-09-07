import { useDialog } from "@/composables/useDialog"

export type DeleteEntryDialogParams = {
  id: string
}

const { visible, params, openDialog, closeDialog } = useDialog<DeleteEntryDialogParams>()

export function useDeleteEntryDialog() {
  return {
    visible,
    params,
    openDeleteEntryDialog: openDialog,
    closeDeleteEntryDialog: closeDialog,
  }
}
