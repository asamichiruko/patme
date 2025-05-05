import { generateId } from "@/utils/idUtils.js"

export class EntryService {
  constructor({ entryRepository, taggingRepository, tagRepository }) {
    this.entryRepos = entryRepository
    this.taggingRepos = taggingRepository
    this.tagRepos = tagRepository
  }

  addEntry({ content, date, stars }) {
    const achievement = {
      id: generateId(),
      content,
      date,
      stars: stars.map((s) => ({
        id: generateId(),
        content: s.content,
        date: s.date,
      })),
    }

    this.entryRepos.add(achievement)
    return achievement
  }

  addAchievement({ content, date }) {
    const achievement = {
      id: generateId(),
      content,
      date,
    }

    this.entryRepos.addAchievement(achievement)
    return achievement
  }

  addStar({ achievementId, content, date }) {
    if (!this.entryRepos.hasAchievement(achievementId)) {
      return null
    }

    const star = {
      id: generateId(),
      content,
      date,
      achievementId,
    }

    this.entryRepos.addStar(star)
    return star
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
