export class LocalStorageAdapter {
  constructor() {}

  load(key) {
    if (typeof key !== "string" || key.trim() === "") {
      throw new Error("Invalid key: expected non-empty string")
    }
    const item = localStorage.getItem(key)
    if (item === null) {
      throw new Error(`Key "${key}" not found in storage`)
    }
    return JSON.parse(item) || undefined
  }

  save(key, value) {
    if (typeof key !== "string" || key.trim() === "") {
      throw new Error("Invalid key: expected non-empty string")
    }
    if (typeof value !== "object" || value === null) {
      throw new Error("Invalid value: expected a non-null object")
    }
    localStorage.setItem(key, JSON.stringify(value))
  }
}
