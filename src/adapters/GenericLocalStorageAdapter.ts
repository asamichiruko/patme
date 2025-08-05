import { loadFromLocalStorage, saveToLocalStorage } from "./storageUtils"

export class GenericLocalStorageAdapter<T extends { id: string }> {
  constructor(private storageKey: string) {}

  async get(id: string): Promise<T | null> {
    const data = loadFromLocalStorage<T>(this.storageKey)
    return data[id] ?? null
  }

  async getAll(): Promise<T[]> {
    const data = loadFromLocalStorage<T>(this.storageKey)
    return Object.values(data)
  }

  async set(item: T): Promise<void> {
    const data = loadFromLocalStorage<T>(this.storageKey)
    data[item.id] = item
    saveToLocalStorage(this.storageKey, data)
  }

  async delete(id: string): Promise<void> {
    const data = loadFromLocalStorage<T>(this.storageKey)
    delete data[id]
    saveToLocalStorage(this.storageKey, data)
  }
}
