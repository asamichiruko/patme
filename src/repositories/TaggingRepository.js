export class TaggingRepository {
  constructor(storage) {
    this.storage = storage
    this.key = "taggings"
  }

  _load() {
    return this.storage.load(this.key) || []
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

  updateAll(tagging) {
    this._save(tagging)
  }

  remove({ achievementId, tagId }) {
    const taggings = this._load().filter(
      (t) => !(t.achievementId === achievementId && t.tagId === tagId),
    )
    this._save(taggings)
  }
}
