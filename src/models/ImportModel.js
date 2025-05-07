import { notify } from "../utils/storageNotifier"

export class ImportModel {
  constructor(importService) {
    this.importService = importService
  }

  async importFromFile(file) {
    try {
      const jsonString = await file.text()
      const json = JSON.parse(jsonString)
      this.importService.importData(json)
      notify()
    } catch (e) {
      throw new Error("インポート時に問題が発生しました", { cause: e })
    }
  }
}
