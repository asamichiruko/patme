import type { CommentRepository } from "@/repositories/CommentRepository"
import type { EntryRepository } from "@/repositories/EntryRepository"
import type { TagRepository } from "@/repositories/TagRepository"
import type { Comment } from "@/schemas/Comment"
import type { Entry } from "@/schemas/Entry"
import type { EntryWithRelations } from "@/schemas/EntryWithRelations"
import type { Tag } from "@/schemas/Tag"
import type { ExportedData } from "@/schemas/ExportedData"

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

    entries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    tags.sort((a, b) => a.sortOrder - b.sortOrder)

    // const commentsGroupByEntryId = Map.groupBy(comments, (comment) => comment.entryId)

    const commentsGroupByEntryId = new Map<string, Comment[]>()
    entries.forEach((entry) => {
      commentsGroupByEntryId.set(entry.id, [])
    })
    comments.forEach((comment) => {
      if (!commentsGroupByEntryId.has(comment.entryId)) return
      commentsGroupByEntryId.get(comment.entryId)!.push(comment)
    })

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

  async updateEntryTags(id: string, tagIds: string[]): Promise<void> {
    const entry = await this.entryRepo.get(id)
    if (!entry) throw new Error(`Entry ${id} not found`)
    await this.entryRepo.update({ ...entry, tagIds })
  }

  async addCommentToEntry(
    entryId: string,
    commentBody: Omit<Comment, "id" | "entryId" | "createdAt">,
  ): Promise<string> {
    const entry = await this.entryRepo.get(entryId)
    if (!entry) throw new Error(`entry ${entryId} not found`)
    if (commentBody.reviewType) {
      this.entryRepo.update({ ...entry, isReviewed: true })
    }
    return await this.commentRepo.create({ ...commentBody, entryId })
  }

  async getAllTags(): Promise<Tag[]> {
    return await this.tagRepo.getAll()
  }

  async getTagByTitle(title: string): Promise<Tag | null> {
    return await this.tagRepo.getByTitle(title)
  }

  async createTag(tagBody: Omit<Tag, "id" | "createdAt" | "sortOrder">): Promise<string> {
    return await this.tagRepo.create(tagBody)
  }

  async countEntriesWithTag(tagId: string): Promise<number> {
    return await this.entryRepo.countEntriesWithTag(tagId)
  }

  async deleteTagAndDetachFromEntries(tagId: string): Promise<void> {
    const entries = await this.entryRepo.getEntriesWithTag(tagId)
    entries.forEach(async (entry) => {
      const updated = {
        ...entry,
        tagIds: entry.tagIds.filter((id) => id !== tagId),
      }
      await this.entryRepo.update(updated)
    })

    await this.tagRepo.delete(tagId)
  }

  async reorderTags(orderedTags: Tag[]): Promise<void> {
    await this.tagRepo.updateSortOrders(orderedTags)
  }

  async exportAllData(): Promise<ExportedData> {
    const [entries, comments, tags] = await Promise.all([
      this.entryRepo.getAll(),
      this.commentRepo.getAll(),
      this.tagRepo.getAll(),
    ])

    return {
      version: 1,
      entries,
      comments,
      tags,
    }
  }

  async restoreAllData(data: ExportedData): Promise<void> {
    if (data.version !== 1) {
      throw new Error("Unsupported export data version")
    }

    if (
      !Array.isArray(data.entries) ||
      !Array.isArray(data.comments) ||
      !Array.isArray(data.tags)
    ) {
      throw new Error("Invalid data format")
    }

    await Promise.all([
      this.entryRepo.restoreAll(data.entries),
      this.commentRepo.restoreAll(data.comments),
      this.tagRepo.restoreAll(data.tags),
    ])
  }
}
