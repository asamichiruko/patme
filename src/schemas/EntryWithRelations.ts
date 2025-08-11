import type { Entry } from "@/schemas/Entry"
import type { Comment } from "@/schemas/Comment"
import type { Tag } from "@/schemas/Tag"

export type EntryWithRelations = Entry & {
  comments: Comment[]
  tags: Tag[]
}
