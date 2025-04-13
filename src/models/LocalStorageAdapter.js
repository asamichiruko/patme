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
}
