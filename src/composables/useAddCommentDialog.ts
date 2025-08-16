import type { EntryType } from "@/schemas/EntryType"
import { ref } from "vue"

type Resolver = ((id: string | null) => void) | null

const isOpen = ref(false)
const targetEntryId = ref<string | null>(null)
const originalEntryType = ref<EntryType | null>(null)
const resolver = ref<Resolver>(null)

export function useAddCommentDialog() {
  const openAddComment = (entryId: string, entryType: EntryType): Promise<string | null> => {
    return new Promise((resolve) => {
      originalEntryType.value = entryType
      targetEntryId.value = entryId
      isOpen.value = true
      resolver.value = resolve as Resolver
    })
  }

  const closeAddComment = (id: string | null) => {
    if (resolver.value) {
      resolver.value(id)
    }
    isOpen.value = false
    targetEntryId.value = null
    originalEntryType.value = null
    resolver.value = null
  }

  return {
    isOpen,
    targetEntryId,
    originalEntryType,
    openAddComment,
    closeAddComment,
  }
}
