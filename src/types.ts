import type { Comment } from "./schemas/Comment"
import type { Entry } from "./schemas/Entry"
import type { Tag } from "./schemas/Tag"

export interface ExportedData {
  version: number
  entries: Entry[]
  comments: Comment[]
  tags: Tag[]
}
