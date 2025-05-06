export class LocalStorageAdapter {
  constructor() {}

  load(key) {
    return JSON.parse(localStorage.getItem(key)) || []
  }

  save(key, values) {
    localStorage.setItem(key, JSON.stringify(values))
  }
}
