import { notify } from "@/utils/storageNotifier"

export class TaggingModel {
  constructor({ taggingService, tagService }) {
    this.taggingService = taggingService
    this.tagService = tagService
  }

  generateTaggingId(tagging) {
    return [tagging.achievementId, tagging.tagId].join(",")
  }

  parseTaggingId(taggingId) {
    const [achievementId, tagId] = taggingId.split(",")
    return { achievementId, tagId }
  }

  updateTaggings({ achievementId, tagIds }) {
    this.taggingService.updateTaggings(achievementId, tagIds)
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
