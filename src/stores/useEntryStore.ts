import { defineStore } from "pinia"
import type { Entry } from "@/schemas/Entry"
import type { EntryWithRelations } from "@/schemas/EntryWithRelations"
import type { StorageService } from "@/services/StorageService"
import { ref } from "vue"

export const useEntryStore = defineStore("entry", () => {
  const entriesWithRelations = ref<EntryWithRelations[]>([])
  const storageService = ref<StorageService | null>(null)

  function initialize(service: StorageService) {
    storageService.value = service
  }

  async function fetchEntriesWithRelations(): Promise<void> {
    if (!storageService.value) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      entriesWithRelations.value = await storageService.value.getAllEntriesWithRelations()
    } catch (err) {
      console.error("Failed to fetch entries", err)
    }
  }

  function reset() {
    entriesWithRelations.value = []
    storageService.value = null
  }

  async function createEntry(entryBody: Omit<Entry, "id" | "createdAt">): Promise<string | null> {
    if (!storageService.value) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      const id = await storageService.value.createEntry(entryBody)
      await fetchEntriesWithRelations()
      return id
    } catch (err) {
      console.error("Failed to create entry", err)
      return null
    }
  }

  async function countEntriesWithTag(tagId: string): Promise<number> {
    if (!storageService.value) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      return await storageService.value.countEntriesWithTag(tagId)
    } catch (err) {
      console.error("Failed to get number of entries with tag", err)
      return 0
    }
  }

  async function updateEntryTags(id: string, tagIds: string[]): Promise<void> {
    if (!storageService.value) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      await storageService.value.updateEntryTags(id, tagIds)
      await fetchEntriesWithRelations()
    } catch (err) {
      console.error("Failed to update entry tags", err)
    }
  }

  return {
    entriesWithRelations,
    initialize,
    fetchEntriesWithRelations,
    reset,
    createEntry,
    countEntriesWithTag,
    updateEntryTags,
  }
})
