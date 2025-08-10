import { z } from "zod"
import { EntryTypeSchema } from "./EntryType"

export const CommentSchema = z.object({
  id: z.string(),
  entryId: z.string(),
  createdAt: z.iso.datetime(),
  content: z.string(),
  reviewType: EntryTypeSchema.nullable(),
})

export type Comment = z.infer<typeof CommentSchema>
