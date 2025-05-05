import { notify } from "@/utils/storageNotifier"

export class EntryModel {
  constructor(entryService) {
    this.entryService = entryService
  }
  addAchievement({ content, date }) {
    const result = this.entryService.addAchievement({ content, date })
    if (result) {
      notify()
    }
    return result
  }

  addStar({ achievementId, content, date }) {
    const result = this.entryService.addStar({ achievementId, content, date })
    if (result) {
      notify()
    }
    return result
  }

  getEntriesWithTags({ sortFn = null } = {}) {
    return this.entryService.getEntriesWithTags({ sortFn })
  }
}
