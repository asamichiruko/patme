export type EntryType = "achievement" | "incomplete" | "accepted"

// Entry
export interface EntryBody {
  content: string
  entryType: EntryType
  isReviewed: boolean
  tagIds: string[]
}
export interface EntryMetadata {
  id: string
  createdAt: Date
}
export interface Entry extends EntryBody, EntryMetadata {}

// Comment
export interface CommentBody {
  content: string
  reviewType: EntryType | null
}
export interface CommentMetadata {
  id: string
  entryId: string
  createdAt: Date
}
export interface Comment extends CommentBody, CommentMetadata {}

// Tag
export interface TagBody {
  title: string
}
export interface TagMetadata {
  id: string
  createdAt: Date
  sortOrder: number
}
export interface Tag extends TagBody, TagMetadata {}

export interface DataStoreAdapter {
  getAll(): Promise<Record<string, unknown>[]>
  get(id: string): Promise<Record<string, unknown> | null>
  add(item: Record<string, unknown>): Promise<string>
  update(id: string, item: Record<string, unknown>): Promise<void>
  delete(id: string): Promise<void>
  generateId(): string
  serializeDate(date: Date): unknown
  deserializeDate(rawDate: unknown): Date
}
