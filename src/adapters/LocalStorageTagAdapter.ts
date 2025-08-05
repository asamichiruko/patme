import type { Tag } from "@/types"
import { GenericLocalStorageAdapter } from "./GenericLocalStorageAdapter"

export const tagAdapter = new GenericLocalStorageAdapter<Tag>("tags")
