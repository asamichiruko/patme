import type { Comment } from "@/schemas/Comment"
import type { EntryType } from "@/schemas/EntryType"
import { ref } from "vue"

type Resolver = ((commentBody: Omit<Comment, "id" | "entryId" | "createdAt"> | null) => void) | null

const isOpen = ref(false)
const originalEntryType = ref<EntryType | null>(null)
const resolver = ref<Resolver>(null)

export function useAddCommentDialog() {
  const openAddComment = (
    entryType: EntryType,
  ): Promise<Omit<Comment, "id" | "entryId" | "createdAt"> | null> => {
    return new Promise((resolve) => {
      originalEntryType.value = entryType
      isOpen.value = true
      resolver.value = resolve as Resolver
    })
  }

  const closeAddComment = (commentBody: Omit<Comment, "id" | "entryId" | "createdAt"> | null) => {
    if (resolver.value) {
      resolver.value(commentBody)
    }
    isOpen.value = false
    originalEntryType.value = null
    resolver.value = null
  }

  return {
    isOpen,
    originalEntryType,
    openAddComment,
    closeAddComment,
  }
}
