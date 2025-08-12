import { defineStore } from "pinia"
import type { Tag } from "@/schemas/Tag"

export const useTagStore = defineStore("tag", {
  state: () => ({
    tags: [] as Tag[],
  }),
  actions: {
    async fetchTags() {
      this.tags = await this.$storage.getAllTags()
    },
    async createTag(tagBody: Omit<Tag, "id" | "createdAt" | "sortOrder">) {
      const id = await this.$storage.createTag(tagBody)
      await this.fetchTags()
      return id
    },
    async deleteTag(tagId: string) {
      await this.$storage.deleteTag(tagId)
      await this.fetchTags()
    },
    async reorderTags(orderedTags: Tag[]) {
      await this.$storage.reorderTags(orderedTags)
      await this.fetchTags()
    },
  },
})
