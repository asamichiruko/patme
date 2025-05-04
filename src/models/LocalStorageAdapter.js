export class LocalStorageAdapter {
  constructor() {}

  load(key) {
    return JSON.parse(localStorage.getItem(key)) || []
  }

  save(key, values) {
    localStorage.setItem(key, JSON.stringify(values))
  }

  addAchievement({ id, content, date }) {
    const achievements = this.load("achievements")
    achievements.push({ id, content, date })
    this.save("achievements", achievements)
  }

  addStar({ id, achievementId, content, date }) {
    const stars = this.load("stars")
    stars.push({ id, achievementId, content, date })
    this.save("stars", stars)
  }

  addTaggings(taggings) {
    const storageTaggings = this.load("taggings")
    taggings.forEach((a) => {
      storageTaggings.push(a)
    })
    this.save("taggings", storageTaggings)
  }

  removeTaggings(taggings) {
    const storageTaggings = this.load("taggings").filter(
      (t) => !taggings.some((s) => s.achievementId === t.achievementId && s.tagId === t.tagId),
    )
    this.save("taggings", storageTaggings)
  }

  getAchievements() {
    let achievements = this.load("achievements")
    achievements = achievements.map((a) => {
      a.date = new Date(a.date)
      return a
    })
    return achievements
  }

  getStars() {
    let stars = this.load("stars")
    stars = stars.map((a) => {
      a.date = new Date(a.date)
      return a
    })
    return stars
  }

  getTags() {
    return this.load("tags")
  }

  getTaggings() {
    return this.load("taggings")
  }

  replaceAchievements(achievements) {
    this.save("achievements", achievements)
  }

  replaceStars(stars) {
    this.save("stars", stars)
  }

  replaceTags(tags) {
    this.save("tags", tags)
  }

  replaceTaggings(taggings) {
    this.save("taggings", taggings)
  }
}
