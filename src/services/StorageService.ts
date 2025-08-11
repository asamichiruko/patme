import type { CommentRepository } from "@/repositories/CommentRepository"
import type { EntryRepository } from "@/repositories/EntryRepository"
import type { TagRepository } from "@/repositories/TagRepository"
import type { Comment } from "@/schemas/Comment"
import type { Entry } from "@/schemas/Entry"
import type { EntryWithRelations } from "@/schemas/EntryWithRelations"
import type { Tag } from "@/schemas/Tag"

export class StorageService {
  constructor(
    private entryRepo: EntryRepository,
    private commentRepo: CommentRepository,
    private tagRepo: TagRepository,
  ) {}

  async createEntry(entryBody: Omit<Entry, "id" | "createdAt">): Promise<string> {
    return await this.entryRepo.create(entryBody)
  }

  async getAllEntriesWithRelations(): Promise<EntryWithRelations[]> {
    const entries = await this.entryRepo.getAll()
    const comments = await this.commentRepo.getAll()
    const tags = await this.tagRepo.getAll()

    const commentsGroupByEntryId = Map.groupBy(comments, (comment) => comment.entryId)
    const tagMap = new Map<string, Tag>()
    tags.forEach((tag) => {
      tagMap.set(tag.id, tag)
    })

    return entries.map((entry) => {
      const relatedComments = commentsGroupByEntryId.get(entry.id) || []
      const relatedTags =
        entry.tagIds.map((tagId) => tagMap.get(tagId)).filter((tag) => tag !== undefined) || []
      return { ...entry, comments: relatedComments, tags: relatedTags }
    })
  }

  async markEntryReviewed(id: string): Promise<void> {
    const entry = await this.entryRepo.get(id)
    if (!entry) throw new Error(`Entry ${id} not found`)
    await this.entryRepo.update({ ...entry, isReviewed: true })
  }

  async addCommentToEntry(
    entryId: string,
    commentBody: Omit<Comment, "id" | "entryId" | "createdAt">,
  ): Promise<string> {
    return await this.commentRepo.create({ ...commentBody, entryId })
  }

  async getAllTags(): Promise<Tag[]> {
    return await this.tagRepo.getAll()
  }

  async createTag(tagBody: Omit<Tag, "id" | "createdAt" | "sortOrder">): Promise<string> {
    return await this.tagRepo.create(tagBody)
  }

  async deleteTag(tagId: string): Promise<void> {
    await this.tagRepo.delete(tagId)
  }

  async reorderTags(orderedTags: Tag[]): Promise<void> {
    await this.tagRepo.updateSortOrders(orderedTags)
  }
}
