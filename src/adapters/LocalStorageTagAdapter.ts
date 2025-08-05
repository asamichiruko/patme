import type { Tag, Adapter } from "@/types"
import { LocalStorageAdapter } from "./LocalStorageAdapter"

export class LocalStorageTagAdapter extends LocalStorageAdapter<Tag> implements Adapter<Tag> {
  constructor() {
    super("tags")
  }
}
