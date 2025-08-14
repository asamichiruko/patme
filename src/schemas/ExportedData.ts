import { z } from "zod"
import { EntrySchema } from "./Entry"
import { CommentSchema } from "./Comment"
import { TagSchema } from "./Tag"

export const ExportedDataSchema = z.object({
  version: z.number().int().positive(),
  entries: z.array(EntrySchema),
  comments: z.array(CommentSchema),
  tags: z.array(TagSchema),
})

export type ExportedData = z.infer<typeof ExportedDataSchema>
