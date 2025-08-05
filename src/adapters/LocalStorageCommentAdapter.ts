import type { Comment } from "@/types"
import { GenericLocalStorageAdapter } from "./GenericLocalStorageAdapter"

export const commentAdapter = new GenericLocalStorageAdapter<Comment>("comments")
