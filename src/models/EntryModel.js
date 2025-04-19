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

  getEntries() {
    const achievements = this.storage.getAchievements()
    const stars = this.storage.getStars()
    const result = Map.groupBy(stars, (star) => {
      return star.achievementId
    })
    const entries = achievements.map((a) => {
      return {
        achievement: a,
        stars: result.get(a.id) || [],
      }
    })
    entries.sort((a, b) => b.achievement.date - a.achievement.date)

    return entries
  }

  exportAsJson() {
    const achievements = this.storage.getAchievements()
    const stars = this.storage.getStars()
    const exportObject = { achievements, stars }
    return exportObject
  }

  importFromJson(json) {
    let newAchievements = json["achievements"]
    let newStars = json["stars"]

    if (!Array.isArray(newAchievements) || !Array.isArray(newStars)) {
      throw new SyntaxError(`Invalid data type: ${json}`)
    }

    const existingAchievementIds = new Set(this.storage.getAchievements().map((a) => a.id))
    const existingStarIds = new Set(this.storage.getStars().map((a) => a.id))

    const { validated: achievements, idSet: allAchievementIds } = this.validateAchievements(
      newAchievements,
      existingAchievementIds,
    )

    const { validated: stars } = this.validateStars(newStars, existingStarIds, allAchievementIds)

    this.storage.importAchievements(achievements)
    this.storage.importStars(stars)
    this.notify()
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
}
