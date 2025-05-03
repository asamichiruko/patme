import { generateId, isValidId, generateTaggingId, parseTaggingId } from "@/utils/idUtils.js"

export class EntryModel {
  constructor(storage) {
    this.storage = storage
    this.listeners = []
  }

  subscribe(listener) {
    this.listeners.push(listener)
  }

  notify() {
    const entries = this.getEntries()
    this.listeners.forEach((listener) => listener(entries))
  }

  addAchievement({ content }) {
    const id = generateId()
    const date = new Date()
    const achievement = { id, content, date }

    if (!this.isValidAchievement(achievement)) {
      return false
    }

    this.storage.addAchievement({ id, content, date })
    this.notify()
    return true
  }

  addStar({ achievementId, content }) {
    const id = generateId()
    const date = new Date()
    const star = { id, achievementId, content, date }

    if (!this.isValidAchievement(star)) {
      return false
    }

    this.storage.addStar(star)
    this.notify()
    return true
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
    this.notify()

    return newTag
  }

  setTagsForAchievement({ achievementId, tagIds }) {
    if (!isValidId(achievementId)) {
      return
    }
    const existingTaggings = this.storage
      .getTaggings()
      .filter((tagging) => tagging.achievementId === achievementId)
    const existingTaggingIds = new Set(
      existingTaggings.map((tagging) => generateTaggingId(tagging)),
    )
    const existingTagIds = new Set(this.storage.getTags().map((tag) => tag.id))
    const updateTaggingIds = new Set(
      tagIds
        .filter((tagId) => isValidId(tagId) && existingTagIds.has(tagId))
        .map((tagId) => generateTaggingId({ achievementId, tagId })),
    )

    const toAdd = updateTaggingIds.difference(existingTaggingIds)
    const toRemove = existingTaggingIds.difference(updateTaggingIds)

    this.storage.addTaggings(Array.from(toAdd).map((id) => parseTaggingId(id)))
    this.storage.removeTaggings(Array.from(toRemove).map((id) => parseTaggingId(id)))
    this.notify()
  }

  updateTags(updated) {
    this.storage.replaceTags(updated)
    this.notify()
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

  getEntries() {
    const achievements = this.storage.getAchievements()
    const stars = this.storage.getStars()
    const tags = this.getAllTags()
    const taggings = this.storage.getTaggings()

    const groupedStars = Map.groupBy(stars, (star) => star.achievementId)
    const groupedTags = Map.groupBy(this.resolveTagTitles(tags, taggings), (t) => t.achievementId)

    const entries = achievements.map((a) => ({
      achievement: a,
      stars: groupedStars.get(a.id) || [],
      tags: groupedTags.get(a.id) || [],
    }))
    entries.sort((a, b) => b.achievement.date - a.achievement.date)
    for (const entry of entries) {
      entry.tags.sort((a, b) => a.order - b.order)
    }

    return entries
  }

  resolveTagTitles(tags, taggings) {
    const tagMap = new Map(tags.map((t) => [t.id, t]))
    const resolved = taggings.map((t) => ({
      achievementId: t.achievementId,
      id: t.tagId,
      title: tagMap.get(t.tagId).title,
      order: tagMap.get(t.tagId).order,
    }))
    return resolved
  }

  exportAsJson() {
    const achievements = this.storage.getAchievements()
    const stars = this.storage.getStars()
    const tags = this.getAllTags()
    const taggings = this.storage.getTaggings()
    const exportObject = { achievements, stars, tags, taggings }
    return exportObject
  }

  importFromJson(json) {
    // json データ形式の確認
    if (![json.achievements, json.stars, json.tags, json.taggings].every(Array.isArray)) {
      throw new SyntaxError("Invalid data format")
    }

    this.importAchievements(json.achievements)
    this.importStars(json.stars)
    this.importTags(json.tags)
    this.importTaggings(json.taggings)

    this.notify()
  }

  importAchievements(data) {
    const filteredAchievements = this.filterAchievements(data)
    const existingAchievements = this.storage.getAchievements()
    const { merged: mergedAchievements } = this.mergeAchievements(
      existingAchievements,
      filteredAchievements,
    )
    this.storage.replaceAchievements(mergedAchievements)
  }

  filterAchievements(data) {
    return data
      .map((a) => ({ id: a.id, content: a.content, date: a.date }))
      .filter((a) => this.isValidAchievement(a))
  }

  isValidAchievement({ id, content, date }) {
    let isValid = true
    isValid = isValid && isValidId(id)
    isValid = isValid && content && content !== ""
    isValid = isValid && new Date(date).toString() !== "Invalid Date"

    return isValid
  }

  mergeAchievements(existingData, newerData) {
    const newerMap = new Map(newerData.map((a) => [a.id, a]))

    const merged = [...existingData]
    const rejected = []
    const existingIds = new Set(existingData.map((a) => a.id))

    newerMap.forEach((dat, id) => {
      if (existingIds.has(id)) {
        rejected.push(dat)
      } else {
        merged.push(dat)
        existingIds.add(id)
      }
    })
    merged.sort((a, b) => a.date - b.date)

    return {
      merged: merged,
      rejected: rejected,
    }
  }

  importStars(data) {
    const filteredStars = this.filterStars(data)
    const existingStars = this.storage.getStars()
    const { merged: mergedStars } = this.mergeStars(existingStars, filteredStars)
    this.storage.replaceStars(mergedStars)
  }

  filterStars(data) {
    const existingAchievementIds = new Set(this.storage.getAchievements().map((a) => a.id))
    return data
      .map((a) => ({ id: a.id, achievementId: a.achievementId, content: a.content, date: a.date }))
      .filter((a) => this.isValidStar(a) && existingAchievementIds.has(a.achievementId))
  }

  isValidStar({ id, achievementId, content, date }) {
    let isValid = true
    isValid = isValid && isValidId(id)
    isValid = isValid && isValidId(achievementId)
    isValid = isValid && content && content !== ""
    isValid = isValid && new Date(date).toString() !== "Invalid Date"

    return isValid
  }

  mergeStars(existingData, newerData) {
    const newerMap = new Map(newerData.map((a) => [a.id, a]))

    const merged = [...existingData]
    const rejected = []
    const existingIds = new Set(existingData.map((a) => a.id))

    newerMap.forEach((dat, id) => {
      if (existingIds.has(id)) {
        rejected.push(dat)
      } else {
        existingIds.add(dat.id)
        merged.push(dat)
      }
    })
    merged.sort((a, b) => a.date - b.date)

    return {
      merged: merged,
      rejected: rejected,
    }
  }

  importTags(data) {
    const filteredTags = this.filterTags(data)
    const existingTags = this.storage.getTags()
    const { merged: mergedTags } = this.mergeTags(existingTags, filteredTags)
    this.storage.replaceTags(mergedTags)
  }

  filterTags(data) {
    return data
      .map((a) => ({ id: a.id, title: a.title, order: a.order }))
      .filter((a) => this.isValidTag(a))
  }

  isValidTag({ id, title }) {
    let isValid = true
    isValid = isValid && isValidId(id)
    isValid = isValid && typeof title == "string"

    return isValid
  }

  mergeTags(existingData, newerData) {
    const ordered = []

    // まず order を一意に振る
    let maxOrder = Math.max(0, ...existingData.map((a) => a.order || 0))

    for (const dat of existingData) {
      if (!dat.order) {
        maxOrder += 1
        dat.order = maxOrder
      }
      ordered.push(dat)
    }
    for (const dat of newerData) {
      maxOrder += 1
      dat.order = maxOrder
      ordered.push(dat)
    }

    ordered.sort((a, b) => a.order - b.order)

    const merged = []
    const rejected = []

    // id または title が重複するものを除去する
    const existingId = new Set()
    const existingTitle = new Set()

    for (const dat of ordered) {
      if (existingId.has(dat.id) || existingTitle.has(dat.title)) {
        rejected.push(dat)
      } else {
        existingId.add(dat.id)
        existingTitle.add(dat.title)
        merged.push(dat)
      }
    }

    return {
      merged: merged,
      rejected: rejected,
    }
  }

  importTaggings(data) {
    const filteredTaggings = this.filterTaggings(data)
    const existingTaggings = this.storage.getTaggings()
    const { merged: mergedTaggings } = this.mergeTaggings(existingTaggings, filteredTaggings)
    this.storage.replaceTaggings(mergedTaggings)
  }

  filterTaggings(data) {
    const existingAchievementIds = new Set(this.storage.getAchievements().map((a) => a.id))
    const existingTagIds = new Set(this.storage.getTags().map((a) => a.id))
    return data
      .map((a) => ({ achievementId: a.achievementId, tagId: a.tagId }))
      .filter(
        (a) =>
          this.isValidTagging(a) &&
          existingAchievementIds.has(a.achievementId) &&
          existingTagIds.has(a.tagId),
      )
  }

  isValidTagging({ achievementId, tagId }) {
    let isValid = true
    isValid = isValid && isValidId(achievementId)
    isValid = isValid && isValidId(tagId)

    return isValid
  }

  mergeTaggings(existingData, newerData) {
    const existingIds = new Set(
      existingData.map((a) =>
        generateTaggingId({ achievementId: a.achievementId, tagId: a.tagId }),
      ),
    )
    const merged = [...existingData]
    const rejected = []

    for (const dat of newerData) {
      const newTaggingId = generateTaggingId({
        achievementId: dat.achievementId,
        tagId: dat.tagId,
      })

      if (existingIds.has(newTaggingId)) {
        rejected.push(parseTaggingId(newTaggingId))
      } else {
        existingIds.add(newTaggingId)
        merged.push(parseTaggingId(newTaggingId))
      }
    }

    return { merged: merged, rejected: rejected }
  }
}
