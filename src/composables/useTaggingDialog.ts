import { ref } from "vue"

type Resolver = ((initialTagId: string[] | null) => void) | null

const isOpen = ref(false)
const targetEntryId = ref<string | null>(null)
const initialTagIds = ref<string[]>([])
const resolver = ref<Resolver>(null)

export function useTaggingDialog() {
  const openTaggingDialog = (entryId: string, tagIds: string[]) => {
    return new Promise<string[] | null>((resolve) => {
      targetEntryId.value = entryId
      initialTagIds.value = tagIds
      isOpen.value = true
      resolver.value = resolve as Resolver
    })
  }

  const closeTaggingDialog = (selectedTagIds: string[] | null) => {
    if (resolver.value) {
      resolver.value(selectedTagIds)
    }
    isOpen.value = false
    targetEntryId.value = null
    initialTagIds.value = []
    resolver.value = null
  }

  return {
    isOpen,
    targetEntryId,
    initialTagIds,
    openTaggingDialog,
    closeTaggingDialog,
  }
}
