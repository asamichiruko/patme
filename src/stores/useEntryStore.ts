import { defineStore } from "pinia"
import type { Entry } from "@/schemas/Entry"
import type { EntryWithRelations } from "@/schemas/EntryWithRelations"
import type { StorageService } from "@/services/StorageService"
import { ref } from "vue"

let instance: StorageService | null = null

export const useEntryStore = defineStore("entry", () => {
  const entriesWithRelations = ref<EntryWithRelations[]>([])

  async function fetchEntriesWithRelations(): Promise<void> {
    if (!instance) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      entriesWithRelations.value = await instance.getAllEntriesWithRelations()
    } catch (err) {
      console.error("Failed to fetch entries", err)
    }
  }

  async function createEntry(entryBody: Omit<Entry, "id" | "createdAt">): Promise<string | null> {
    if (!instance) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      const id = await instance.createEntry(entryBody)
      await fetchEntriesWithRelations()
      return id
    } catch (err) {
      console.error("Failed to create entry", err)
      return null
    }
  }

  async function countEntriesWithTag(tagId: string): Promise<number> {
    if (!instance) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      return await instance.countEntriesWithTag(tagId)
    } catch (err) {
      console.error("Failed to get number of entries with tag", err)
      return 0
    }
  }

  async function updateEntryTags(id: string, tagIds: string[]): Promise<void> {
    if (!instance) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      await instance.updateEntryTags(id, tagIds)
      await fetchEntriesWithRelations()
    } catch (err) {
      console.error("Failed to update entry tags", err)
    }
  }

  return {
    entriesWithRelations,
    fetchEntriesWithRelations,
    createEntry,
    countEntriesWithTag,
    updateEntryTags,
  }
})

export function initializeEntryService(service: StorageService) {
  instance = service
}
