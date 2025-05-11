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

  add(tag) {
    const tags = this._load()
    tags.push(tag)
    this._save(tags)
  }

  has(id) {
    return this._load().some((t) => t.id === id)
  }

  getAll() {
    return this._load()
  }

  findByTitle(title) {
    return this._load().find((t) => t.title === title) || null
  }

  updateAll(tag) {
    this._save(tag)
  }
}
