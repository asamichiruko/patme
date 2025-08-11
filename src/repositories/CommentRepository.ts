import type { DataStoreAdapter } from "@/types"
import { type Comment, CommentSchema } from "@/schemas/Comment"

export class CommentRepository {
  constructor(private adapter: DataStoreAdapter<Comment>) {}

  async get(id: string): Promise<Comment | null> {
    const rawData = await this.adapter.get(id)
    return rawData ? CommentSchema.parse(rawData) : null
  }

  async getAll(): Promise<Comment[]> {
    const rawDataArray = await this.adapter.getAll()
    return rawDataArray.map((rawData) => CommentSchema.parse(rawData))
  }

  async add(commentBody: Omit<Comment, "id" | "createdAt">): Promise<string> {
    const newComment: Omit<Comment, "id"> = {
      ...commentBody,
      createdAt: new Date().toISOString(),
    }
    return this.adapter.add(CommentSchema.omit({ id: true }).parse(newComment))
  }

  async update(comment: Comment): Promise<void> {
    this.adapter.update(CommentSchema.parse(comment))
  }

  async delete(id: string): Promise<void> {
    await this.adapter.delete(id)
  }
}
