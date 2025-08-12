import { defineStore } from "pinia"
import type { Tag } from "@/schemas/Tag"
import type { StorageService } from "@/services/StorageService"
import { ref } from "vue"

let instance: StorageService | null = null

export const useTagStore = defineStore("tag", () => {
  const tags = ref<Tag[]>([])

  async function fetchTags(): Promise<void> {
    if (!instance) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      tags.value = await instance.getAllTags()
    } catch (err) {
      console.error("Failed to fetch tags", err)
    }
  }

  async function createTag(
    tagBody: Omit<Tag, "id" | "createdAt" | "sortOrder">,
  ): Promise<string | null> {
    if (!instance) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      const id = await instance.createTag(tagBody)
      await fetchTags()
      return id
    } catch (err) {
      console.error("Failed to create tags", err)
      return null
    }
  }

  async function deleteTag(tagId: string): Promise<void> {
    if (!instance) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      await instance.deleteTag(tagId)
      await fetchTags()
    } catch (err) {
      console.error("Failed to delete tags", err)
    }
  }

  async function reorderTags(orderedTags: Tag[]): Promise<void> {
    if (!instance) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      await instance.reorderTags(orderedTags)
      await fetchTags()
    } catch (err) {
      console.error("Failed to reorder tags", err)
    }
  }

  return { tags, fetchTags, createTag, deleteTag, reorderTags }
})

export function initializeTagService(service: StorageService) {
  instance = service
}
