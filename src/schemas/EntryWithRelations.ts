import { z } from "zod"
import { EntrySchema } from "./Entry"
import { CommentSchema } from "./Comment"
import { TagSchema } from "./Tag"

export const EntryWithRelationsSchema = EntrySchema.extend({
  comments: z.array(CommentSchema),
  tags: z.array(TagSchema),
})

export type EntryWithRelations = z.infer<typeof EntryWithRelationsSchema>
