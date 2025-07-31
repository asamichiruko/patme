export class EntryRepository {
  constructor(storage) {
    this.storage = storage
    this.achievementKey = "achievements"
    this.starKey = "stars"
    if (!this.storage.has(this.achievementKey)) {
      this.storage.save(this.achievementKey, [])
    }
    if (!this.storage.has(this.starKey)) {
      this.storage.save(this.starKey, [])
    }
  }

  _loadAchievements() {
    return this.storage.load(this.achievementKey)
  }

  _saveAchievements(achievements) {
    this.storage.save(this.achievementKey, achievements)
  }

  _loadStar() {
    return this.storage.load(this.starKey)
  }

  _saveStar(stars) {
    this.storage.save(this.starKey, stars)
  }

  add({ id, content, date, isReviewed, entryType, stars }) {
    this.addAchievement({ id, content, date, isReviewed, entryType })

    stars.forEach((star) => {
      this.addStar({
        id: star.id,
        achievementId: id,
        content: star.content,
        reviewedType: star.reviewedType,
        date: star.date,
      })
    })
  }

  addAchievement(achievement) {
    const storageAchievements = this._loadAchievements()
    storageAchievements.push(achievement)
    this._saveAchievements(storageAchievements)
  }

  addStar(star) {
    const storageStars = this._loadStar()
    storageStars.push(star)
    this._saveStar(storageStars)
  }

  hasAchievement(achievementId) {
    return this._loadAchievements().some((a) => a.id === achievementId)
  }

  hasStar(starId) {
    return this._loadStar().some((a) => a.id === starId)
  }

  getAchievement(achievementId) {
    return this._loadAchievements().find((a) => a.id === achievementId)
  }

  getAchievements() {
    return this._loadAchievements()
  }

  getStars() {
    return this._loadStar()
  }

  getAll() {
    const achievements = this._loadAchievements()
    const stars = this._loadStar()

    const starMap = Map.groupBy(stars, (s) => s.achievementId)
    return achievements.map((a) => ({
      id: a.id,
      content: a.content,
      date: a.date,
      entryType: a.entryType,
      stars: starMap.get(a.id) || [],
    }))
  }

  updateAchievement(achievement) {
    let storageAchievements = this._loadAchievements()
    storageAchievements = storageAchievements.map((a) =>
      a.id === achievement.id ? achievement : a,
    )
    this._saveAchievements(storageAchievements)
  }

  updateStar(star) {
    let storageStars = this._loadStar()
    storageStars = storageStars.map((a) => (a.id === star.id ? star : a))
    this._loadStar(storageStars)
  }
}
