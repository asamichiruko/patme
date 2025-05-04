import { generateId } from "@/utils/idUtils.js"

export class TagService {
  constructor(tagRepository, taggingRepository) {
    this.tagRepos = tagRepository
    this.taggingRepos = taggingRepository
  }

  addTag(title) {
    if (!title || this.tagRepos.findByTitle(title)) {
      return null
    }

    const tags = this.tagRepos.getAll()
    const maxOrder = tags.reduce((max, tag) => Math.max(max, tag.order), 0)
    const newTag = {
      id: generateId(),
      title: title,
      order: maxOrder + 1,
    }

    this.tagRepos.add(newTag)
    return newTag
  }

  getTagsOrdered() {
    const tags = this.tagRepos.getAll()
    tags.sort((a, b) => a.order - b.order)
    return tags
  }

  updateTags(idsInNewOrder) {
    const tags = this.tagRepos.getAll()
    const tagMap = new Map(tags.map((t) => [t.id, t]))
    const reorderedTags = []

    idsInNewOrder.forEach((id, index) => {
      const tag = tagMap.get(id)
      if (tag) {
        tag.order = index + 1
        reorderedTags.push(tag)
      }
    })

    this.tagRepos.updateAll(reorderedTags)
  }
}
