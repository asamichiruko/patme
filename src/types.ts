export type EntryType = "achievement" | "incomplete" | "accepted"

export type Entry = {
  id: string
  createdAt: string
  content: string
  entryType: EntryType
  isReviewed: boolean
  tagIds: string[]
}

export type Comment = {
  id: string
  entryId: string
  createdAt: string
  content: string
  reviewType: EntryType | null
}

export type Tag = {
  id: string
  title: string
  sortOrder: number
}

export type Identifiable = { id: string }
export type WithoutId<T extends Identifiable> = Omit<T, "id">

export interface DataStoreAdapter<T extends Identifiable> {
  generateId(): string
  getAll(): Promise<T[]>
  get(id: string): Promise<T | null>
  add(item: WithoutId<T>): Promise<string>
  update(id: string, item: Partial<WithoutId<T>>): Promise<void>
  delete(id: string): Promise<void>
}

export interface EntryRepository {
  getAll(): Promise<Entry[]>
  get(id: string): Promise<Entry>
  add(item: WithoutId<Entry>): Promise<string>
}
