import { useDialog } from "./useDialog"

export interface TaggingParams {
  entryId: string
  tagIds: string[]
}

const { visible, params, openDialog, closeDialog } = useDialog<TaggingParams>()

export function useTaggingDialog() {
  return {
    visible,
    params,
    openTaggingDialog: openDialog,
    closeTaggingDialog: closeDialog,
  }
}
