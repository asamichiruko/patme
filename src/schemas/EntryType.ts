import { z } from "zod"

export const EntryTypeSchema = z.enum(["achievement", "incomplete", "accepted"])

export type EntryType = z.infer<typeof EntryTypeSchema>
