import type { StorageService } from "@/services/StorageService"
import type { ExportedData } from "@/schemas/ExportedData"
import { defineStore } from "pinia"
import { useEntryStore } from "./useEntryStore"
import { useTagStore } from "./useTagStore"

let instance: StorageService | null = null

export const useDataTransferStore = defineStore("dataTransfer", () => {
  function reset() {
    instance = null
  }

  async function exportAll(): Promise<ExportedData | null> {
    if (!instance) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      return await instance.exportAllData()
    } catch (err) {
      console.error("Failed to export all data", err)
      return null
    }
  }

  async function restoreAll(data: ExportedData): Promise<void> {
    if (!instance) {
      throw new Error("StorageService has not been initialized")
    }
    try {
      await instance.restoreAllData(data)

      const entryStore = useEntryStore()
      const tagStore = useTagStore()

      entryStore.fetchEntriesWithRelations()
      tagStore.fetchTags()
    } catch (err) {
      console.error("Failed to export all data", err)
    }
  }

  return { reset, exportAll, restoreAll }
})

export function initializeDataTransferService(service: StorageService) {
  instance = service
}
