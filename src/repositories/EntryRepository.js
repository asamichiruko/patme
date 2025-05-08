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

  add({ id, content, date, stars }) {
    const storageAchievements = this._loadAchievements()
    storageAchievements.push({ id, content, date })
    this._saveAchievements(storageAchievements)

    const storageStars = this._loadStar()
    stars.forEach((star) => {
      storageStars.push({
        id: star.id,
        achievementId: id,
        content: star.content,
        date: star.date,
      })
    })
    this._saveStar(storageStars)
  }

  addAchievement({ id, content, date }) {
    const storageAchievements = this._loadAchievements()
    storageAchievements.push({ id, content, date })
    this._saveAchievements(storageAchievements)
  }

  addStar({ id, achievementId, content, date }) {
    const storageStars = this._loadStar()
    storageStars.push({ id, achievementId, content, date })
    this._saveStar(storageStars)
  }

  hasAchievement(achievementId) {
    return this._loadAchievements().some((a) => a.id === achievementId)
  }

  hasStar(starId) {
    return this._loadStar().some((a) => a.id === starId)
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
      stars: starMap.get(a.id) || [],
    }))
  }

  updateAchievement({ id, content, date }) {
    let storageAchievements = this._loadAchievements()
    storageAchievements = storageAchievements.map((a) => (a.id === id ? { id, content, date } : a))
    this._saveAchievements(storageAchievements)
  }

  updateStar({ id, achievementId, content, date }) {
    let storageStars = this._loadStar()
    storageStars = storageStars.map((a) => (a.id === id ? { id, achievementId, content, date } : a))
    this._loadStar(storageStars)
  }
}
