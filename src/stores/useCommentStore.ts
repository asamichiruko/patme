import { defineStore } from "pinia"
import type { Comment } from "@/schemas/Comment"
import type { StorageService } from "@/services/StorageService"
import { ref } from "vue"

export const useCommentStore = defineStore("comment", () => {
  const storageService = ref<StorageService | null>(null)

  function initialize(service: StorageService) {
    storageService.value = service
  }

  function reset() {
    storageService.value = null
  }

  async function addComment(
    entryId: string,
    commentBody: Omit<Comment, "id" | "entryId" | "createdAt">,
  ): Promise<string | null> {
    if (!storageService.value) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      const id = await storageService.value.addCommentToEntry(entryId, commentBody)
      return id
    } catch (err) {
      console.error("Failed to create comment", err)
      return null
    }
  }

  return { initialize, reset, addComment }
})
