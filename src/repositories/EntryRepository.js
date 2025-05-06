export class EntryRepository {
  constructor(storage) {
    this.storage = storage
    this.achievementKey = "achievements"
    this.starKey = "stars"
  }

  add({ id, content, date, stars }) {
    const storageAchievements = this.storage.load(this.achievementKey)
    storageAchievements.push({ id, content, date })
    this.storage.save(this.achievementKey, storageAchievements)

    const storageStars = this.storage.load(this.starKey)
    stars.forEach((star) => {
      storageStars.push({
        id: star.id,
        achievementId: id,
        content: star.content,
        date: star.date,
      })
    })
    this.storage.save(this.starKey, storageStars)
  }

  addAchievement({ id, content, date }) {
    const storageAchievements = this.storage.load(this.achievementKey)
    storageAchievements.push({ id, content, date })
    this.storage.save(this.achievementKey, storageAchievements)
  }

  addStar({ id, achievementId, content, date }) {
    const storageStars = this.storage.load(this.starKey)
    storageStars.push({ id, achievementId, content, date })
    this.storage.save(this.starKey, storageStars)
  }

  hasAchievement(achievementId) {
    return this.storage.load(this.achievementKey).some((a) => a.id === achievementId)
  }

  hasStar(starId) {
    return this.storage.load(this.starKey).some((a) => a.id === starId)
  }

  getAchievements() {
    return this.storage.load(this.achievementKey)
  }

  getStars() {
    return this.storage.load(this.starKey)
  }

  getAll() {
    const achievements = this.storage.load(this.achievementKey)
    const stars = this.storage.load(this.starKey)

    const starMap = Map.groupBy(stars, (s) => s.achievementId)
    return achievements.map((a) => ({
      id: a.id,
      content: a.content,
      date: a.date,
      stars: starMap.get(a.id) || [],
    }))
  }

  updateAchievement({ id, content, date }) {
    let storageAchievements = this.storage.load(this.achievementKey)
    storageAchievements = storageAchievements.map((a) => (a.id === id ? { id, content, date } : a))
    this.storage.save(this.achievementKey, storageAchievements)
  }

  updateStar({ id, achievementId, content, date }) {
    let storageStars = this.storage.load(this.starKey)
    storageStars = storageStars.map((a) => (a.id === id ? { id, achievementId, content, date } : a))
    this.storage.save(this.starKey, storageStars)
  }
}
