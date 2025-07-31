import { generateId } from "@/utils/idUtils.js"
import { isValidAchievement, isValidStar } from "@/utils/validator.js"

export class EntryService {
  constructor({ entryRepository, taggingRepository, tagRepository }) {
    this.entryRepos = entryRepository
    this.taggingRepos = taggingRepository
    this.tagRepos = tagRepository
  }

  addEntry({ id = null, content, date, stars = [] }) {
    const addedAchievement = this.addAchievement({ id, content, date })
    if (!addedAchievement) {
      return null
    }

    const addedStars = []
    stars.forEach((star) => {
      const result = this.addStar(star)
      if (result) {
        addedStars.push(result)
      }
    })

    return {
      id: addedAchievement.id,
      content,
      date,
      stars: addedStars,
    }
  }

  addAchievement({ id = null, content, date, isReviewed = false, entryType = "achievement" }) {
    const achievementId = id || generateId()

    if (this.entryRepos.hasAchievement(achievementId)) {
      return null
    }

    const achievement = {
      id: achievementId,
      content,
      date,
      isReviewed,
      entryType,
    }

    if (!isValidAchievement(achievement)) {
      return null
    }

    this.entryRepos.addAchievement(achievement)
    return achievement
  }

  addStar({ id = null, achievementId, content, reviewType, date }) {
    const starId = id || generateId()

    if (!this.entryRepos.hasAchievement(achievementId)) {
      return null
    }
    if (this.entryRepos.hasStar(id)) {
      return null
    }

    const star = {
      id: starId,
      content,
      reviewType,
      date,
      achievementId,
    }

    if (!isValidStar(star)) {
      return null
    }
    if (reviewType) {
      const achievement = this.entryRepos.getAchievement(achievementId)
      achievement.isReviewed = true
      this.entryRepos.updateAchievement(achievement)
    }

    this.entryRepos.addStar(star)
    return star
  }

  getAchievements() {
    return this.entryRepos.getAchievements()
  }

  getStars() {
    return this.entryRepos.getStars()
  }

  getEntriesWithTags() {
    const entries = this.entryRepos.getAll()
    const taggings = this.taggingRepos.getAll()
    const tags = this.tagRepos.getAll()

    const tagMap = new Map(tags.map((tag) => [tag.id, tag]))
    const resolvedTaggings = taggings.map((t) => ({
      achievementId: t.achievementId,
      id: t.tagId,
      title: tagMap.get(t.tagId).title,
      order: tagMap.get(t.tagId).order,
    }))
    const taggingMap = Map.groupBy(resolvedTaggings, (t) => t.achievementId)

    const resolvedEntries = entries.map((entry) => ({
      ...entry,
      tags: taggingMap.get(entry.id)?.toSorted((a, b) => a.order - b.order) || [],
    }))

    return resolvedEntries
  }
}
