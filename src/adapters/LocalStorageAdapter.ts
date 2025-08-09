import type { DataStoreAdapter } from "@/types"

export class LocalStorageAdapter implements DataStoreAdapter {
  constructor(private storageKey: string) {}

  private loadFromLocalStorage(): Record<string, unknown>[] {
    const raw = localStorage.getItem(this.storageKey)
    if (!raw) return []
    return JSON.parse(raw)
  }

  private saveToLocalStorage(data: Record<string, unknown>[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  async get(id: string): Promise<Record<string, unknown> | null> {
    const data = this.loadFromLocalStorage()
    const result = data.find((dat) => dat.id === id)
    if (!result) return null
    return result
  }

  async getAll(): Promise<Record<string, unknown>[]> {
    const data = this.loadFromLocalStorage()
    return data
  }

  async add(body: Record<string, unknown>): Promise<string> {
    const data = this.loadFromLocalStorage()
    const id = this.generateId()
    const createdAt = this.serializeDate(new Date())

    const exists = data.some((dat) => dat.id === id)
    if (exists) throw new Error(`Item ${id} already exists`)

    data.push({ ...body, id, createdAt })
    this.saveToLocalStorage(data)
    return id
  }

  async update(id: string, body: Record<string, unknown>): Promise<void> {
    const data = this.loadFromLocalStorage()

    let exists = false
    const updatedData = data.map((dat) => {
      if (dat.id === id) {
        exists = true
        return { ...dat, ...body }
      }
      return dat
    })
    if (!exists) throw new Error(`Item ${id} not found`)

    this.saveToLocalStorage(updatedData)
  }

  async delete(id: string): Promise<void> {
    const data = this.loadFromLocalStorage()
    const filtered = data.filter((dat) => dat.id !== id)
    this.saveToLocalStorage(filtered)
  }

  generateId(): string {
    return crypto.randomUUID()
  }

  serializeDate(date: Date): string {
    return date.toISOString()
  }

  deserializeDate(rawDate: unknown): Date {
    return new Date(rawDate as string)
  }
}
