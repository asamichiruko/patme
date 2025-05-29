import { defineStore } from "pinia"
import { notify } from "@/utils/storageNotifier.js"

let localTagService

export const useTagStore = defineStore("tag", {
  actions: {
    setService({ tagService }) {
      localTagService = tagService
    },
    addTag(title) {
      if (!localTagService) {
        throw new Error("TagService not set")
      }
      const result = localTagService.addTag({ title: title.trim() })

      if (result) {
        notify()
      }
      return result
    },
    findByTitle(title) {
      if (!localTagService) {
        throw new Error("TagService not set")
      }
      return localTagService.findByTitle({ title: title.trim() })
    },
    getTagsOrdered() {
      if (!localTagService) {
        throw new Error("TagService not set")
      }
      return localTagService.getTagsOrdered()
    },
    reorderTagByIds(idsInNewOrder) {
      if (!localTagService) {
        throw new Error("TagService not set")
      }
      localTagService.reorderTagByIds(idsInNewOrder)
      notify()
    },
  },
})
