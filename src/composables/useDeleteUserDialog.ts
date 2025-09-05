import { useDialog } from "@/composables/useDialog"

export type DeleteUserDialogParams = object

const { visible, params, openDialog, closeDialog } = useDialog<DeleteUserDialogParams>()

export function useDeleteUserDialog() {
  return {
    visible,
    params,
    openDeleteUserDialog: openDialog,
    closeDeleteUserDialog: closeDialog,
  }
}
