export class TaggingService {
  constructor({ taggingRepository, tagRepository }) {
    this.taggingRepos = taggingRepository
    this.tagRepos = tagRepository
  }

  isValidTagId(tagId) {
    return this.tagRepos.getAll().some((t) => t.id === tagId)
  }

  addTagging({ achievementId, tagId }) {
    if (!this.isValidTagId(tagId)) {
      return null
    }

    if (this.taggingRepos.has({ achievementId, tagId })) {
      return null
    }

    this.taggingRepos.add({ achievementId, tagId })
    return { achievementId, tagId }
  }

  listTagIdsByAchievement(achievementId) {
    return this.taggingRepos.findByAchievementId(achievementId).map((t) => t.tagId)
  }

  listAchievementIdsByTag(tagId) {
    return this.taggingRepos.findByTagId(tagId).map((t) => t.achievementId)
  }

  getTaggings() {
    return this.taggingRepos.getAll()
  }

  updateTaggings(achievementId, tagIds) {
    const currentTagIds = this.listTagIdsByAchievement(achievementId)
    const currentTagIdSet = new Set(currentTagIds)
    const tagIdSet = new Set(tagIds)

    tagIds.forEach((tagId) => {
      if (!currentTagIdSet.has(tagId)) {
        this.addTagging({ achievementId, tagId })
      }
    })

    currentTagIds.forEach((tagId) => {
      if (!tagIdSet.has(tagId)) {
        this.removeTagging({ achievementId, tagId })
      }
    })
  }

  removeTagging({ achievementId, tagId }) {
    this.taggingRepos.remove({ achievementId, tagId })
  }
}
