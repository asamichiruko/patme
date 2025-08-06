import type { Identifiable, DataStoreAdapter, WithoutId } from "@/types"

function loadFromLocalStorage<T>(key: string): Record<string, T> {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : {}
}

function saveToLocalStorage<T>(key: string, data: Record<string, T>): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export class LocalStorageAdapter<T extends Identifiable> implements DataStoreAdapter<T> {
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

  async add(item: WithoutId<T>): Promise<string> {
    const data = loadFromLocalStorage<{ id: string } & WithoutId<T>>(this.storageKey)
    const id: string = this.generateId()

    if (data[id]) throw new Error(`Item ${id} already exists`)

    data[id] = { ...item, id }
    saveToLocalStorage(this.storageKey, data)
    return id
  }

  async update(id: string, item: Partial<WithoutId<T>>): Promise<void> {
    const data = loadFromLocalStorage<T>(this.storageKey)

    const existing = data[id]
    if (!existing) throw new Error(`Item ${id} not found`)

    data[id] = { ...existing, ...item }
    saveToLocalStorage(this.storageKey, data)
  }

  async delete(id: string): Promise<void> {
    const data = loadFromLocalStorage<T>(this.storageKey)
    delete data[id]
    saveToLocalStorage(this.storageKey, data)
  }
}
