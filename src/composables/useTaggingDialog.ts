import { ref } from "vue"

type Resolver = ((initialTagId: string[] | null) => void) | null

const isOpen = ref(false)
const initialTagIds = ref<string[]>([])
const resolver = ref<Resolver>(null)

export function useTaggingDialog() {
  const openTaggingDialog = (tagIds: string[]) => {
    return new Promise<string[] | null>((resolve) => {
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
    initialTagIds.value = []
    resolver.value = null
  }

  return {
    isOpen,
    initialTagIds,
    openTaggingDialog,
    closeTaggingDialog,
  }
}
