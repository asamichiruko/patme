import type { Entry, Adapter } from "@/types"
import { LocalStorageAdapter } from "./LocalStorageAdapter"

export class LocalStorageEntryAdapter extends LocalStorageAdapter<Entry> implements Adapter<Entry> {
  constructor() {
    super("entries")
  }
}
