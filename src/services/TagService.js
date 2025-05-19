import { generateId } from "@/utils/idUtils.js"

export class TagService {
  constructor({ tagRepository }) {
    this.tagRepos = tagRepository
  }

  findByTitle({ title }) {
    if (!title) {
      return null
    }
    return this.tagRepos.findByTitle(title)
  }

  addTag({ id = null, title }) {
    if (!title || this.tagRepos.findByTitle(title)) {
      return null
    }

    const tagId = id || generateId()
    const tags = this.tagRepos.getAll()
    const maxOrder = tags.reduce((max, tag) => Math.max(max, tag.order), 0)
    const newTag = {
      id: tagId,
      title,
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

  reorderTagByIds(idsInNewOrder) {
    const tags = this.tagRepos.getAll()

    if (
      !this._isArraysEqual(
        tags.map((t) => t.id),
        idsInNewOrder,
      )
    ) {
      throw new Error("Invalid ids: ids Set must be equal to existing tags")
    }

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

  _isArraysEqual(a, b) {
    if (a.length !== b.length) {
      return false
    }

    const sortedA = a.toSorted()
    const sortedB = b.toSorted()

    return sortedA.every((value, index) => value === sortedB[index])
  }
}
