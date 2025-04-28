export class LocalStorageAdapter {
  constructor() {}

  loadAchievements() {
    return JSON.parse(localStorage.getItem("achievements")) || []
  }

  saveAchievements(achievements) {
    localStorage.setItem("achievements", JSON.stringify(achievements))
  }

  loadStars() {
    return JSON.parse(localStorage.getItem("stars")) || []
  }

  saveStars(stars) {
    localStorage.setItem("stars", JSON.stringify(stars))
  }

  loadTags() {
    return JSON.parse(localStorage.getItem("tags")) || []
  }

  saveTags(tags) {
    localStorage.setItem("tags", JSON.stringify(tags))
  }

  loadTaggings() {
    return JSON.parse(localStorage.getItem("taggings")) || []
  }

  saveTaggings(taggings) {
    localStorage.setItem("taggings", JSON.stringify(taggings))
  }

  addAchievement({ id, content, date }) {
    const achievements = this.loadAchievements()
    achievements.push({ id, content, date })
    this.saveAchievements(achievements)
  }

  addStar({ id, achievementId, content, date }) {
    const stars = this.loadStars()
    stars.push({ id, achievementId, content, date })
    this.saveStars(stars)
  }

  addTag({ id, title, order }) {
    const tags = this.loadTags()
    tags.push({ id, title, order })
    this.saveTags(tags)
  }

  addTaggings(taggings) {
    const storageTaggings = this.loadTaggings()
    taggings.forEach((a) => {
      storageTaggings.push(a)
    })
    this.saveTaggings(storageTaggings)
  }

  removeTaggings(taggings) {
    const storageTaggings = this.loadTaggings().filter(
      (t) => !taggings.some((s) => s.achievementId === t.achievementId && s.tagId === t.tagId),
    )
    this.saveTaggings(storageTaggings)
  }

  getAchievements() {
    let achievements = this.loadAchievements()
    achievements = achievements.map((a) => {
      a.date = new Date(a.date)
      return a
    })
    return achievements
  }

  getStars() {
    let stars = this.loadStars()
    stars = stars.map((a) => {
      a.date = new Date(a.date)
      return a
    })
    return stars
  }

  getTags() {
    return this.loadTags()
  }

  getTaggings() {
    return this.loadTaggings()
  }

  importAchievements(achievements) {
    const storageAchievements = this.loadAchievements()
    achievements.forEach((a) => {
      storageAchievements.push(a)
    })
    this.saveAchievements(storageAchievements)
  }

  importStars(stars) {
    const storageStars = this.loadStars()
    stars.forEach((a) => {
      storageStars.push(a)
    })
    this.saveStars(storageStars)
  }

  importTags(tags) {
    const storageTags = this.loadTags()
    tags.forEach((a) => {
      storageTags.push(a)
    })
    this.saveTags(storageTags)
  }

  importTaggings(taggings) {
    this.saveTaggings(taggings)
  }
}
