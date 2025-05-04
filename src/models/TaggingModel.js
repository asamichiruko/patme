import { isValidId } from "@/utils/idUtils.js"
import { notify } from "@/utils/storageNotifier"

export class TaggingModel {
  constructor(taggingRepos, tagRepos) {
    this.taggingRepos = taggingRepos
    this.tagRepos = tagRepos
  }

  generateTaggingId(tagging) {
    return [tagging.achievementId, tagging.tagId].join(",")
  }

  parseTaggingId(taggingId) {
    const [achievementId, tagId] = taggingId.split(",")
    return { achievementId, tagId }
  }

  setTagsForAchievement({ achievementId, tagIds }) {
    if (!isValidId(achievementId)) {
      return
    }
    const existingTaggings = this.taggingRepos
      .getAll()
      .filter((tagging) => tagging.achievementId === achievementId)

    const existingTaggingIds = new Set(
      existingTaggings.map((tagging) => this.generateTaggingId(tagging)),
    )

    const existingTagIds = new Set(this.tagRepos.getAll().map((tag) => tag.id))
    const updateTaggingIds = new Set(
      tagIds
        .filter((tagId) => isValidId(tagId) && existingTagIds.has(tagId))
        .map((tagId) => this.generateTaggingId({ achievementId, tagId })),
    )

    const toAdd = updateTaggingIds.difference(existingTaggingIds)
    const toRemove = existingTaggingIds.difference(updateTaggingIds)

    toAdd.values().forEach((taggingId) => {
      const tagging = this.parseTaggingId(taggingId)
      this.taggingRepos.add(tagging)
    })
    toRemove.values().forEach((taggingId) => {
      const tagging = this.parseTaggingId(taggingId)
      this.taggingRepos.remove(tagging)
    })

    notify()
  }

  resolveTagTitles({ taggings, tags }) {
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
