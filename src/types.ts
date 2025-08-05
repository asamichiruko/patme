export type EntryType = "achievement" | "incomplete" | "accepted"

export interface Entry {
  id: string
  createdAt: string
  content: string
  entryType: EntryType
  isReviewed: boolean
  tagIds: string[]
}

export interface Comment {
  id: string
  entryId: string
  createdAt: string
  content: string
  reviewType: EntryType | null
}

export interface Tag {
  id: string
  title: string
  sortOrder: number
}

export type Identifiable = { id: string }
export type WithId<T extends Identifiable> = Omit<T, "id"> & { id: string }
export type WithoutId<T extends Identifiable> = Omit<T, "id">
export type Updatable<T extends Identifiable> = { id: string } & Partial<WithoutId<T>>

export interface Adapter<T extends Identifiable> {
  generateId(): string
  getAll(): Promise<T[]>
  get(id: string): Promise<T | null>
  set(item: T): Promise<void>
  add(item: WithoutId<T>): Promise<WithId<T>>
  update(item: Updatable<T>): Promise<void>
  delete(id: string): Promise<void>
}
