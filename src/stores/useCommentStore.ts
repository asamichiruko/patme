import { defineStore } from "pinia"
import type { Comment } from "@/schemas/Comment"

export const useCommentStore = defineStore("comment", {
  actions: {
    async addComment(entryId: string, commentBody: Omit<Comment, "id" | "entryId" | "createdAt">) {
      const id = await this.$storage.addCommentToEntry(entryId, commentBody)
      return id
    },
  },
})
