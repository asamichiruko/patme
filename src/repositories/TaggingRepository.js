export class TaggingRepository {
  constructor(storage) {
    this.storage = storage
    this.key = "taggings"
    if (!this.storage.has(this.key)) {
      this.storage.save(this.key, [])
    }
  }

  _load() {
    return this.storage.load(this.key)
  }

  _save(taggings) {
    this.storage.save(this.key, taggings)
  }

  add({ achievementId, tagId }) {
    const taggings = this._load()
    taggings.push({ achievementId, tagId })
    this._save(taggings)
  }

  getAll() {
    return this._load()
  }

  has({ achievementId, tagId }) {
    return this._load().some((t) => t.achievementId === achievementId && t.tagId === tagId)
  }

  findByAchievementId(achievementId) {
    return this._load().filter((t) => t.achievementId === achievementId)
  }

  findByTagId(tagId) {
    return this._load().filter((t) => t.tagId === tagId)
  }

  updateAll(taggings) {
    this._save(taggings)
  }

  remove({ achievementId, tagId }) {
    const taggings = this._load().filter(
      (t) => !(t.achievementId === achievementId && t.tagId === tagId),
    )
    this._save(taggings)
  }
}
