import { defineStore } from "pinia"
import type { Comment } from "@/schemas/Comment"
import type { StorageService } from "@/services/StorageService"

let instance: StorageService | null = null

export const useCommentStore = defineStore("comment", () => {
  function reset() {
    instance = null
  }

  async function addComment(
    entryId: string,
    commentBody: Omit<Comment, "id" | "entryId" | "createdAt">,
  ): Promise<string | null> {
    if (!instance) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      const id = await instance.addCommentToEntry(entryId, commentBody)
      return id
    } catch (err) {
      console.error("Failed to create comment", err)
      return null
    }
  }

  return { reset, addComment }
})

export function initializeCommentService(service: StorageService) {
  instance = service
}
