import { notify } from "@/utils/storageNotifier"
import { generateId } from "@/utils/idUtils"

export class TagModel {
  constructor(storage) {
    this.storage = storage
  }

  addTag({ title }) {
    title = title?.trim()
    if (!title) return null

    const allTags = this.storage.getTags()
    const allTagTitles = allTags.map((tag) => tag.title)
    if (allTagTitles.includes(title)) {
      return null
    }

    const maxOrder = Math.max(0, ...allTags.map((tag) => tag.order || 0))
    const newTag = { id: generateId(), title: title, order: maxOrder + 1 }
    this.storage.addTag(newTag)
    notify()

    return newTag
  }

  updateTags(updated) {
    this.storage.replaceTags(updated)
    notify()
  }

  getAllTags() {
    let tags = this.storage.getTags()
    let maxOrder = Math.max(0, ...tags.map((tag) => tag.order || 0))
    tags = this.storage.getTags().map((tag) => {
      if (!tag.order) {
        maxOrder += 1
        tag.order = maxOrder
      }
      return tag
    })
    tags.sort((a, b) => a.order - b.order)
    return tags
  }

  resolveTagTitles(taggings, tags = null) {
    if (tags === null) {
      tags = this.getAllTags()
    }
    const tagMap = new Map(tags.map((t) => [t.id, t]))
    const resolved = taggings.map((t) => ({
      achievementId: t.achievementId,
      id: t.tagId,
      title: tagMap.get(t.tagId).title,
      order: tagMap.get(t.tagId).order,
    }))
    return resolved
  }
}
