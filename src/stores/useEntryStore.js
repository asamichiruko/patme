import { defineStore } from "pinia"
import { notify } from "@/utils/storageNotifier"

let localEntryService

export const useEntryStore = defineStore("entry", {
  actions: {
    setService({ entryService }) {
      localEntryService = entryService
    },
    getEntriesWithTags({ sortFn }) {
      if (!localEntryService) {
        throw new Error("EntryService not set")
      }
      return localEntryService.getEntriesWithTags({ sortFn })
    },
    addAchievement({ content, date }) {
      if (!localEntryService) {
        throw new Error("EntryService not set")
      }
      const result = localEntryService.addAchievement({ content, date })
      if (result) {
        notify()
      }
      return result
    },
    addStar({ achievementId, content, date }) {
      if (!localEntryService) {
        throw new Error("EntryService not set")
      }
      const result = localEntryService.addStar({ achievementId, content, date })
      if (result) {
        notify()
      }
      return result
    },
  },
})
