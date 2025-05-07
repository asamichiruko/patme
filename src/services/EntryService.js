import { generateId } from "@/utils/idUtils.js"

export class EntryService {
  constructor({ entryRepository, taggingRepository, tagRepository }) {
    this.entryRepos = entryRepository
    this.taggingRepos = taggingRepository
    this.tagRepos = tagRepository
  }

  addEntry({ id = null, content, date, stars = [] }) {
    const achievementId = id || generateId()
    if (this.entryRepos.hasAchievement(achievementId)) {
      return null
    }

    const starIdSet = new Set(this.entryRepos.getStars())
    const filteredStars = stars
      .map((s) => ({
        id: s.id || generateId(),
        content: s.content,
        date: s.date,
      }))
      .filter((s) => {
        if (!starIdSet.has(s.id)) {
          starIdSet.add(s.id)
          return true
        } else {
          return false
        }
      })

    const achievement = {
      id: achievementId,
      content,
      date,
      stars: filteredStars,
    }

    this.entryRepos.add(achievement)
    return achievement
  }

  addAchievement({ id = null, content, date }) {
    const achievementId = id || generateId()

    if (this.entryRepos.hasAchievement(achievementId)) {
      return null
    }

    const achievement = {
      id: achievementId,
      content,
      date,
    }

    this.entryRepos.addAchievement(achievement)
    return achievement
  }

  addStar({ id = null, achievementId, content, date }) {
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
      date,
      achievementId,
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

  getEntriesWithTags({ sortFn = null } = {}) {
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
      tags: taggingMap.get(entry.id) || [],
    }))

    if (sortFn) {
      resolvedEntries.sort(sortFn)
    }

    return resolvedEntries
  }
}
