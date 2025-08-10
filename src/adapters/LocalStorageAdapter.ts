import type { DataStoreAdapter } from "@/types"

export class LocalStorageAdapter<T extends { id: string }> implements DataStoreAdapter<T> {
  constructor(private storageKey: string) {}

  private read(): T[] {
    const json = localStorage.getItem(this.storageKey)
    return json ? (JSON.parse(json) as T[]) : []
  }

  private write(data: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  async get(id: string): Promise<T | null> {
    return this.read().find((item) => item.id === id) || null
  }

  async getAll(): Promise<T[]> {
    return this.read()
  }

  async add(itemBody: Omit<T, "id">): Promise<string> {
    const data = this.read()
    const id = this.generateId()

    if (data.some((existing) => existing.id === id)) {
      throw new Error(`Item ${id} already exists`)
    }

    data.push({ ...itemBody, id } as T)
    this.write(data)
    return id
  }

  async update(item: T): Promise<void> {
    const data = this.read()

    let exists = false
    const updatedData = data.map((existing) => {
      if (existing.id === item.id) {
        exists = true
        return item
      }
      return existing
    })
    if (!exists) throw new Error(`Item ${item.id} not found`)

    this.write(updatedData)
  }

  async updateAll(items: T[]): Promise<void> {
    const data = this.read()
    const dataIdSet = new Set<string>(data.map((dat) => dat.id))
    const itemsIdSet = new Set<string>(items.map((item) => item.id))

    if (items.length !== itemsIdSet.size) throw new Error("duplicate id in items")
    if (!itemsIdSet.isSubsetOf(dataIdSet) || !dataIdSet.isSubsetOf(itemsIdSet))
      throw new Error("id set is not equal to existing id set")

    this.write(items)
  }

  async delete(id: string): Promise<void> {
    const data = this.read()
    const filtered = data.filter((dat) => dat.id !== id)
    this.write(filtered)
  }

  generateId(): string {
    return crypto.randomUUID()
  }
}
