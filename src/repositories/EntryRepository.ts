import type { DataStoreAdapter, Entry, EntryBody } from "@/types"
import { parseDate, parseEntryType } from "./parseDataUtils"

export class EntryRepository {
  constructor(private adapter: DataStoreAdapter) {}

  private toEntryObject(rawData: Record<string, unknown>): Entry {
    if (!rawData) throw new Error("Data is null or undefined")
    if (!rawData.id) throw new Error("Data id is required")

    return {
      id: rawData.id.toString(),
      createdAt: parseDate(rawData.createdAt),
      content: rawData.content ? rawData.content.toString() : "",
      entryType: parseEntryType(rawData.entryType),
      isReviewed: Boolean(rawData.isReviewed),
      tagIds: Array.isArray(rawData.tagIds) ? rawData.tagIds : [],
    }
  }

  private toStorageObject(body: EntryBody): Record<string, unknown> {
    if (!body) throw new Error("Data is null or undefined")

    return {
      content: body.content ? body.content.toString() : "",
      entryType: parseEntryType(body.entryType),
      isReviewed: Boolean(body.isReviewed),
      tagIds: Array.isArray(body.tagIds) ? body.tagIds : [],
    }
  }

  async get(id: string): Promise<Entry | null> {
    const rawData = await this.adapter.get(id)
    if (!rawData) return null
    return this.toEntryObject(rawData)
  }

  async getAll(): Promise<Entry[]> {
    const rawDataArray = await this.adapter.getAll()
    return rawDataArray.map((rawData) => this.toEntryObject(rawData))
  }

  async add(entryBody: EntryBody): Promise<string> {
    return this.adapter.add(this.toStorageObject(entryBody))
  }

  async update(id: string, entryBody: EntryBody): Promise<void> {
    this.adapter.update(id, this.toStorageObject(entryBody))
  }

  async delete(id: string): Promise<void> {
    this.adapter.delete(id)
  }
}
