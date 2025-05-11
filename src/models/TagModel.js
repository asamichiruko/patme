import { notify } from "@/utils/storageNotifier.js"

export class TagModel {
  constructor(tagService) {
    this.tagService = tagService
  }

  addTag({ title }) {
    this.tagService.addTag({ title })
    notify()
  }

  getTagsOrdered() {
    return this.tagService.getTagsOrdered()
  }

  reorderTagByIds(idsInNewOrder) {
    this.tagService.reorderTagByIds(idsInNewOrder)
    notify()
  }
}
