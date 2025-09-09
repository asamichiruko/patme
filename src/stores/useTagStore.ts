import { defineStore } from "pinia"
import type { Tag } from "@/schemas/Tag"
import type { StorageService } from "@/services/StorageService"
import { ref } from "vue"

export const useTagStore = defineStore("tag", () => {
  const storageService = ref<StorageService | null>(null)
  const tags = ref<Tag[]>([])

  function initialize(service: StorageService) {
    storageService.value = service
  }

  async function fetchTags(): Promise<void> {
    if (!storageService.value) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      const fetchedTags = await storageService.value.getAllTags()
      tags.value = fetchedTags.toSorted((a, b) => a.sortOrder - b.sortOrder)
    } catch (err) {
      console.error("Failed to fetch tags", err)
    }
  }

  function reset() {
    tags.value = []
    storageService.value = null
  }

  async function getTagByTitle(title: string): Promise<Tag | null> {
    if (!storageService.value) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      const tag = tags.value.find((t) => t.title === title)
      if (tag) return tag
      return await storageService.value.getTagByTitle(title)
    } catch (err) {
      console.error("Failed to fetch tag by title", err)
      return null
    }
  }

  async function createTag(
    tagBody: Omit<Tag, "id" | "createdAt" | "sortOrder">,
  ): Promise<string | null> {
    if (!storageService.value) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      const id = await storageService.value.createTag(tagBody)
      await fetchTags()
      return id
    } catch (err) {
      console.error("Failed to create tags", err)
      return null
    }
  }

  async function deleteTagAndDetachFromEntries(tagId: string): Promise<void> {
    if (!storageService.value) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      await storageService.value.deleteTagAndDetachFromEntries(tagId)
      await fetchTags()
    } catch (err) {
      console.error("Failed to delete tags", err)
    }
  }

  async function reorderTags(orderedTags: Tag[]): Promise<void> {
    if (!storageService.value) {
      throw new Error("StorageService has not been initialized")
    }
    tags.value = orderedTags
    try {
      await storageService.value.reorderTags(orderedTags)
    } catch (err) {
      console.error("Failed to reorder tags", err)
    }
  }

  return {
    tags,
    initialize,
    fetchTags,
    reset,
    getTagByTitle,
    createTag,
    deleteTagAndDetachFromEntries,
    reorderTags,
  }
})
