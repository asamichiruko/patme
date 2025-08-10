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

  async add(entryBody: Omit<Entry, "id">): Promise<string> {
    return this.adapter.add(EntrySchema.omit({ id: true }).parse(entryBody))
  }

  async update(entry: Entry): Promise<void> {
    this.adapter.update(EntrySchema.parse(entry))
  }

  async delete(id: string): Promise<void> {
    this.adapter.delete(id)
  }
}
