import type { Comment, Adapter } from "@/types"
import { LocalStorageAdapter } from "./LocalStorageAdapter"

export class LocalStorageCommentAdapter
  extends LocalStorageAdapter<Comment>
  implements Adapter<Comment>
{
  constructor() {
    super("comments")
  }
}
