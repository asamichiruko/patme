import type { Identifiable, Adapter, WithId, WithoutId, Updatable } from "@/types"
import { loadFromLocalStorage, saveToLocalStorage } from "./storageUtils"

export class LocalStorageAdapter<T extends Identifiable> implements Adapter<T> {
  constructor(public storageKey: string) {}

  generateId(): string {
    return crypto.randomUUID()
  }

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

  async add(item: WithoutId<T>): Promise<WithId<T>> {
    const data = loadFromLocalStorage<WithId<T>>(this.storageKey)
    const id = this.generateId()

    if (data[id]) throw new Error(`Item ${id} already exists`)

    const fullItem: WithId<T> = { ...item, id }
    data[id] = fullItem
    saveToLocalStorage(this.storageKey, data)
    return fullItem
  }

  async update(item: Updatable<T>): Promise<void> {
    const data = loadFromLocalStorage<T>(this.storageKey)

    const existing = data[item.id]
    if (!existing) throw new Error(`Item ${item.id} not found`)

    data[item.id] = { ...existing, ...item }
    saveToLocalStorage(this.storageKey, data)
  }

  async delete(id: string): Promise<void> {
    const data = loadFromLocalStorage<T>(this.storageKey)
    delete data[id]
    saveToLocalStorage(this.storageKey, data)
  }
}
