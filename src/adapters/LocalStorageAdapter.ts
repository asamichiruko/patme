import type { Entry, Comment, Tag } from "@/types"
import { GenericLocalStorageAdapter } from "./GenericLocalStorageAdapter"

export const entryAdapter = new GenericLocalStorageAdapter<Entry>("entries")
export const commentAdapter = new GenericLocalStorageAdapter<Comment>("comments")
export const tagAdapter = new GenericLocalStorageAdapter<Tag>("tags")
