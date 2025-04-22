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

  generateId() {
    return crypto.randomUUID()
  }

  addAchievement({ content }) {
    const id = this.generateId()
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
    const id = this.generateId()
    const date = new Date()
    const star = { id, achievementId, content, date }

    if (!this.isValidAchievement(star)) {
      return false
    }

    this.storage.addStar(star)
    this.notify()
    return true
  }

  setTagsForAchievement({ achievementId, tagIds }) {
    if (!this.isValidId(achievementId)) {
      return
    }
    const existingTaggings = this.storage
      .getTaggings()
      .filter((tagging) => tagging.achievementId === achievementId)
    const existingTaggingIds = new Set(
      existingTaggings.map((tagging) => this.generateTaggingId(tagging)),
    )
    const existingTagIds = new Set(this.storage.getTags().map((tag) => tag.id))
    const updateTaggingIds = new Set(
      tagIds
        .filter((tagId) => this.isValidId(tagId) && existingTagIds.has(tagId))
        .map((tagId) => this.generateTaggingId({ achievementId, tagId })),
    )

    const toAdd = updateTaggingIds.difference(existingTaggingIds)
    const toRemove = existingTaggingIds.difference(updateTaggingIds)

    this.storage.addTaggings(Array.from(toAdd).map((id) => this.parseTaggingId(id)))
    this.storage.removeTaggings(Array.from(toRemove).map((id) => this.parseTaggingId(id)))
    this.notify()
  }

  addTag({ title }) {
    title = title.trim()
    if (!title) return null

    const allTagTitles = this.storage.getTags().map((tag) => tag.title)
    if (allTagTitles.includes(title)) {
      return null
    }
    const newTag = { id: this.generateId(), title: title }
    this.storage.addTag(newTag)
    this.notify()
    return newTag
  }

  getAllTags() {
    return this.storage.getTags()
  }

  getEntries() {
    const achievements = this.storage.getAchievements()
    const stars = this.storage.getStars()
    const tags = this.storage.getTags()
    const taggings = this.storage.getTaggings()

    const groupedStars = Map.groupBy(stars, (star) => star.achievementId)
    const groupedTags = Map.groupBy(this.resolveTagTitles(tags, taggings), (t) => t.achievementId)

    const entries = achievements.map((a) => ({
      achievement: a,
      stars: groupedStars.get(a.id) || [],
      tags: groupedTags.get(a.id) || [],
    }))
    entries.sort((a, b) => b.achievement.date - a.achievement.date)

    return entries
  }

  resolveTagTitles(tags, taggings) {
    const tagMap = new Map(tags.map((t) => [t.id, t.title]))
    const resolved = taggings.map((t) => ({
      achievementId: t.achievementId,
      id: t.tagId,
      title: tagMap.get(t.tagId),
    }))
    return resolved
  }

  exportAsJson() {
    const achievements = this.storage.getAchievements()
    const stars = this.storage.getStars()
    const tags = this.storage.getTags()
    const taggings = this.storage.getTaggings()
    const exportObject = { achievements, stars, tags, taggings }
    return exportObject
  }

  importFromJson(json) {
    const { achievements, stars, tags, taggings } = this.validateJson(json)

    this.storage.importAchievements(achievements)
    this.storage.importStars(stars)
    this.storage.importTags(tags)
    this.storage.addTaggings(taggings)
    this.notify()
  }

  validateJson(json) {
    if (![json.achievements, json.stars, json.tags, json.taggings].every(Array.isArray)) {
      throw new SyntaxError("Invalid data format")
    }

    const existingAchievementIds = new Set(this.storage.getAchievements().map((a) => a.id))
    const existingStarIds = new Set(this.storage.getStars().map((a) => a.id))
    const existingTagIds = new Set(this.storage.getTags().map((a) => a.id))
    const existingTitles = new Set(this.storage.getTags().map((a) => a.title))
    const existingTaggingIds = new Set(
      this.storage.getTaggings().map((a) => this.generateTaggingId(a.achievementId, a.tagId)),
    )

    const { validated: achievements, idSet: allAchievementIds } = this.validateAchievements(
      json.achievements,
      existingAchievementIds,
    )
    const { validated: stars } = this.validateStars(json.stars, existingStarIds, allAchievementIds)
    const { validated: tags, idSet: allTagIds } = this.validateTags(
      json.tags,
      existingTagIds,
      existingTitles,
    )
    const { validated: taggings } = this.validateTaggings(
      json.taggings,
      existingTaggingIds,
      allAchievementIds,
      allTagIds,
    )

    return { achievements, stars, tags, taggings }
  }

  validateAchievements(jsonArray, existingIds = new Set()) {
    const validated = []

    for (const a of jsonArray) {
      const achievement = {
        id: a.id,
        content: a.content,
        date: new Date(a.date),
      }

      if (existingIds.has(achievement.id) || !this.isValidAchievement(achievement)) {
        continue
      }

      validated.push(achievement)
      existingIds.add(achievement.id)
    }

    return { validated, idSet: existingIds }
  }

  validateStars(jsonArray, existingIds = new Set(), validAchievementIds) {
    const validated = []

    for (const a of jsonArray) {
      const star = {
        id: a.id,
        achievementId: a.achievementId,
        content: a.content,
        date: new Date(a.date),
      }

      if (
        existingIds.has(star.id) ||
        !validAchievementIds.has(star.achievementId) ||
        !this.isValidStar(star)
      ) {
        continue
      }

      validated.push(star)
      existingIds.add(star.id)
    }

    return { validated }
  }

  validateTags(jsonArray, existingIds = new Set(), existingTitles = new Set()) {
    const validated = []

    for (const a of jsonArray) {
      const tag = {
        id: a.id,
        title: a.title,
      }

      if (existingIds.has(tag.id) || existingTitles.has(tag.title) || !this.isValidTag(tag)) {
        continue
      }

      validated.push(tag)
      existingIds.add(tag.id)
      existingTitles.add(tag.title)
    }

    return { validated, idSet: existingIds }
  }

  validateTaggings(jsonArray, existingIds = new Set(), validAchievementIds, validTagIds) {
    const validated = []

    for (const a of jsonArray) {
      const tagging = {
        achievementId: a.achievementId,
        tagId: a.tagId,
      }
      const taggingId = this.generateTaggingId(tagging)

      if (
        !validAchievementIds.has(tagging.achievementId) ||
        !validTagIds.has(tagging.tagId) ||
        existingIds.has(taggingId) ||
        !this.isValidTagging(tagging)
      ) {
        continue
      }

      validated.push(tagging)
      existingIds.add(taggingId)
    }

    return { validated }
  }

  generateTaggingId(tagging) {
    return [tagging.achievementId, tagging.tagId].join(",")
  }

  parseTaggingId(taggingId) {
    const [achievementId, tagId] = taggingId.split(",")
    return { achievementId, tagId }
  }

  isValidId(id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return id && uuidRegex.test(id)
  }

  isValidAchievement({ id, content, date }) {
    let isValid = true
    isValid = isValid && this.isValidId(id)
    isValid = isValid && content && content !== ""
    isValid = isValid && new Date(date).toString() !== "Invalid Date"

    return isValid
  }

  isValidStar({ id, achievementId, content, date }) {
    let isValid = true
    isValid = isValid && this.isValidId(id)
    isValid = isValid && this.isValidId(achievementId)
    isValid = isValid && typeof content == "string"
    isValid = isValid && new Date(date).toString() !== "Invalid Date"

    return isValid
  }

  isValidTag({ id, title }) {
    let isValid = true
    isValid = isValid && this.isValidId(id)
    isValid = isValid && typeof title == "string"

    return isValid
  }

  isValidTagging({ achievementId, tagId }) {
    let isValid = true
    isValid = isValid && this.isValidId(achievementId)
    isValid = isValid && this.isValidId(tagId)

    return isValid
  }
}
