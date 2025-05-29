import { defineStore } from "pinia"
import { notify } from "@/utils/storageNotifier.js"

let localTaggingService

export const useTaggingStore = defineStore("tagging", {
  actions: {
    setService({ taggingService }) {
      localTaggingService = taggingService
    },
    updateTaggings({ achievementId, tagIds }) {
      if (!localTaggingService) {
        throw new Error("TaggingService not set")
      }
      localTaggingService.updateTaggings({ achievementId, tagIds })
      notify()
    },
  },
})
