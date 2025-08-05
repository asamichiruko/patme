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
