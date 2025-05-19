import { notify } from "@/utils/storageNotifier.js"

export class TagModel {
  constructor(tagService) {
    this.tagService = tagService
  }

  findByTitle({ title }) {
    return this.tagService.findByTitle({ title: title.trim() })
  }

  addTag({ title }) {
    const result = this.tagService.addTag({ title: title.trim() })
    if (result) {
      notify()
      return result
    }
    return null
  }

  getTagsOrdered() {
    return this.tagService.getTagsOrdered()
  }

  reorderTagByIds(idsInNewOrder) {
    this.tagService.reorderTagByIds(idsInNewOrder)
    notify()
  }
}
