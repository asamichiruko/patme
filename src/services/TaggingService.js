export class TaggingService {
  constructor({ entryRepository, taggingRepository, tagRepository }) {
    this.entryRepos = entryRepository
    this.taggingRepos = taggingRepository
    this.tagRepos = tagRepository
  }

  addTagging({ achievementId, tagId }) {
    if (!this.tagRepos.has(tagId) || !this.entryRepos.hasAchievement(achievementId)) {
      return null
    }

    if (this.taggingRepos.has({ achievementId, tagId })) {
      return null
    }

    this.taggingRepos.add({ achievementId, tagId })
    return { achievementId, tagId }
  }

  getTaggings() {
    return this.taggingRepos.getAll()
  }

  updateTaggings(achievementId, tagIds) {
    const currentTagIds = this.taggingRepos.findByAchievementId(achievementId).map((t) => t.tagId)
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
