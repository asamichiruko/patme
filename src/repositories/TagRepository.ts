import type { DataStoreAdapter } from "@/types"
import { type Tag, TagSchema } from "@/schemas/Tag"

export class TagRepository {
  constructor(private adapter: DataStoreAdapter<Tag>) {}

  async get(id: string): Promise<Tag | null> {
    const rawData = await this.adapter.get(id)
    return rawData ? TagSchema.parse(rawData) : null
  }

  async getAll(): Promise<Tag[]> {
    const rawDataArray = await this.adapter.getAll()
    return rawDataArray.map((rawData) => TagSchema.parse(rawData))
  }

  async add(tagBody: Omit<Tag, "id" | "createdAt" | "sortOrder">): Promise<string> {
    const allTags = await this.adapter.getAll()
    if (allTags.some((t) => t.title === tagBody.title))
      throw new Error(`Tag title ${tagBody.title} already exists`)

    const maxSortOrder = allTags.reduce((max, tag) => Math.max(max, tag.sortOrder), -1)

    const newTag: Omit<Tag, "id"> = {
      ...tagBody,
      createdAt: new Date().toISOString(),
      sortOrder: maxSortOrder + 1,
    }
    return await this.adapter.add(newTag)
  }

  async update(tag: Tag): Promise<void> {
    const allTags = await this.adapter.getAll()
    if (allTags.some((existing) => existing.title === tag.title && existing.id !== tag.id))
      throw new Error(`Tag title ${tag.title} already exists`)
    await this.adapter.update(TagSchema.parse(tag))
  }

  async updateSortOrders(sortedTags: Tag[]): Promise<void> {
    const updatedTags = sortedTags.map((tag, index) => ({
      ...tag,
      sortOrder: index,
    }))

    updatedTags.forEach((tag) => TagSchema.parse(tag))

    await this.adapter.updateAll(updatedTags)
  }

  async delete(id: string): Promise<void> {
    await this.adapter.delete(id)

    const allTags = await this.getAll()
    allTags.sort((a, b) => a.sortOrder - b.sortOrder)
    await this.updateSortOrders(allTags)
  }
}
