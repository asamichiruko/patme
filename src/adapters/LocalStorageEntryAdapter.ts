import type { Entry } from "@/types"
import { GenericLocalStorageAdapter } from "./GenericLocalStorageAdapter"

export const entryAdapter = new GenericLocalStorageAdapter<Entry>("entries")
