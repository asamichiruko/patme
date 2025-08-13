import type { Comment } from "./schemas/Comment"
import type { Entry } from "./schemas/Entry"
import type { Tag } from "./schemas/Tag"

export interface DataStoreAdapter<T extends { id: string }> {
  get(id: string): Promise<T | null>
  getAll(): Promise<T[]>
  create(itemBody: Omit<T, "id">): Promise<string>
  update(item: T): Promise<void>
  updateAll(items: T[]): Promise<void>
  delete(id: string): Promise<void>
  restoreAll(items: T[]): Promise<void>
}

export interface ExportedData {
  version: number
  entries: Entry[]
  comments: Comment[]
  tags: Tag[]
}
