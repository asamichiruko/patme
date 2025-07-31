import { defineStore } from "pinia"
import { notify } from "@/utils/storageNotifier.js"

let localEntryService

export const useEntryStore = defineStore("entry", {
  actions: {
    setService({ entryService }) {
      localEntryService = entryService
    },
    getEntriesWithTags() {
      if (!localEntryService) {
        throw new Error("EntryService not set")
      }
      return localEntryService.getEntriesWithTags()
    },
    addAchievement({ content, date, entryType }) {
      if (!localEntryService) {
        throw new Error("EntryService not set")
      }
      const result = localEntryService.addAchievement({
        content,
        date,
        isReviewed: false,
        entryType,
      })
      if (result) {
        notify()
      }
      return result
    },
    addStar({ achievementId, content, reviewedType, date }) {
      if (!localEntryService) {
        throw new Error("EntryService not set")
      }
      const result = localEntryService.addStar({ achievementId, content, reviewedType, date })
      if (result) {
        notify()
      }
      return result
    },
  },
})
