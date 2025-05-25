import { defineStore } from "pinia"
import { notify } from "@/utils/storageNotifier.js"

let localImportService
let localExportService

export const useDataTransferStore = defineStore("dataTransfer", {
  actions: {
    setService({ importService, exportService }) {
      localImportService = importService
      localExportService = exportService
    },
    async importFromFile(file) {
      if (!localImportService) {
        throw new Error("ImportService not set")
      }
      try {
        const jsonString = await file.text()
        const json = JSON.parse(jsonString)
        localImportService.importData(json)
        notify()
      } catch (e) {
        throw new Error("インポート時に問題が発生しました", { cause: e })
      }
    },
    exportToFile() {
      if (!localExportService) {
        throw new Error("ExportService not set")
      }
      let blob
      try {
        const json = localExportService.exportData()
        blob = new Blob([JSON.stringify(json)], { type: "application/json" })
      } catch (e) {
        throw new Error("エクスポート時に問題が発生しました", { cause: e })
      }
      return blob
    },
  },
})
