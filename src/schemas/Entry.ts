import { z } from "zod"
import { EntryTypeSchema } from "./EntryType"

export const EntrySchema = z.object({
  id: z.string(),
  createdAt: z.iso.datetime(),
  content: z.string(),
  entryType: EntryTypeSchema,
  isReviewed: z.boolean(),
  tagIds: z.array(z.string()).refine((arr) => new Set(arr).size === arr.length, {
    message: "Duplicate tagIds are not allowed",
  }),
})

export type Entry = z.infer<typeof EntrySchema>
