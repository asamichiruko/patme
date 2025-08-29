import type { StorageService } from "@/services/StorageService"
import type { ExportedData } from "@/schemas/ExportedData"
import { defineStore } from "pinia"
import { useEntryStore } from "./useEntryStore"
import { useTagStore } from "./useTagStore"
import { ref } from "vue"

export const useDataTransferStore = defineStore("dataTransfer", () => {
  const storageService = ref<StorageService | null>(null)

  function initialize(service: StorageService) {
    storageService.value = service
  }

  function reset() {
    storageService.value = null
  }

  async function exportAll(): Promise<ExportedData | null> {
    if (!storageService.value) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      return await storageService.value.exportAllData()
    } catch (err) {
      console.error("Failed to export all data", err)
      return null
    }
  }

  async function restoreAll(data: ExportedData): Promise<void> {
    if (!storageService.value) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      await storageService.value.restoreAllData(data)

      const entryStore = useEntryStore()
      const tagStore = useTagStore()

      entryStore.fetchEntriesWithRelations()
      tagStore.fetchTags()
    } catch (err) {
      console.error("Failed to export all data", err)
    }
  }

  return { initialize, reset, exportAll, restoreAll }
})
