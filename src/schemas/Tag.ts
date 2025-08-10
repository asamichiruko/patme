import { z } from "zod"

export const TagSchema = z.object({
  id: z.string(),
  createdAt: z.iso.datetime(),
  title: z.string(),
  sortOrder: z.number().int().nonnegative(),
})

export type Tag = z.infer<typeof TagSchema>
