export class TagRepository {
  constructor(storage) {
    this.storage = storage
    this.key = "tags"
  }

  _load() {
    return this.storage.load(this.key) || []
  }

  _save(taggings) {
    this.storage.save(this.key, taggings)
  }

  getAll() {
    return this._load()
  }

  add(tag) {
    const tags = this._load()
    tags.push(tag)
    this._save(tags)
  }

  updateAll(tag) {
    this._save(tag)
  }
}
