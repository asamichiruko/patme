export class LocalStorageAdapter {
  constructor() {}

  load(key) {
    if (!this._isValidKey(key)) {
      throw new Error("Invalid key: expected non-empty string")
    }
    const item = localStorage.getItem(key)
    if (item === null) {
      throw new Error(`Key "${key}" not found in storage`)
    }
    return JSON.parse(item) || undefined
  }

  has(key) {
    if (!this._isValidKey(key)) {
      throw new Error("Invalid key: expected non-empty string")
    }
    return localStorage.getItem(key) !== null
  }

  save(key, value) {
    if (!this._isValidKey(key)) {
      throw new Error("Invalid key: expected non-empty string")
    }
    if (!this._isValidValue(value)) {
      throw new Error("Invalid value: expected a non-null object")
    }
    localStorage.setItem(key, JSON.stringify(value))
  }

  _isValidKey(key) {
    return typeof key === "string" && key.trim() !== ""
  }

  _isValidValue(value) {
    return typeof value === "object" && value !== null
  }
}
