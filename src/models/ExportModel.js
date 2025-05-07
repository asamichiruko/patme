export class ExportModel {
  constructor(exportService) {
    this.exportService = exportService
  }

  exportToFile() {
    let blob
    try {
      const json = this.exportService.exportData()
      console.log(json)
      blob = new Blob([JSON.stringify(json)], { type: "application/json" })
    } catch (e) {
      throw new Error("エクスポート時に問題が発生しました", { cause: e })
    }
    return blob
  }
}
