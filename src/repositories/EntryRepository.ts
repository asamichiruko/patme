import type { DataStoreAdapter } from "@/types"
import { type Entry, EntrySchema } from "@/schemas/Entry"

export class EntryRepository {
  constructor(private adapter: DataStoreAdapter<Entry>) {}

  async get(id: string): Promise<Entry | null> {
    const rawData = await this.adapter.get(id)
    return rawData ? EntrySchema.parse(rawData) : null
  }

  async getAll(): Promise<Entry[]> {
    const rawDataArray = await this.adapter.getAll()
    return rawDataArray.map((rawData) => EntrySchema.parse(rawData))
  }

  async create(entryBody: Omit<Entry, "id" | "createdAt">): Promise<string> {
    const newEntry: Omit<Entry, "id"> = {
      ...entryBody,
      createdAt: new Date().toISOString(),
    }
    return await this.adapter.create(EntrySchema.omit({ id: true }).parse(newEntry))
  }

  async update(entry: Entry): Promise<void> {
    await this.adapter.update(EntrySchema.parse(entry))
  }

  async delete(id: string): Promise<void> {
    await this.adapter.delete(id)
  }
}
