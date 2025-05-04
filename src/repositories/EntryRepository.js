export class EntryRepository {
  constructor(storage) {
    this.storage = storage
    this.achievementKey = "achievements"
    this.starKey = "stars"
  }

  add({ id, content, date, stars }) {
    this.storage.save(this.achievementKey, { id, content, date })

    stars.forEach((star) => {
      this.storage.save({
        id: star.id,
        achievementId: id,
        content: star.content,
        date: star.date,
      })
    })
  }

  addAchievement({ id, content, date }) {
    this.storage.save(this.achievementKey, { id, content, date })
  }

  addStar({ id, achievementId, content, date }) {
    this.storage.save(this.starKey, { id, achievementId, content, date })
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
}
