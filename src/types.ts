export interface DataStoreAdapter<T extends { id: string }> {
  get(id: string): Promise<T | null>
  getAll(): Promise<T[]>
  create(itemBody: Omit<T, "id">): Promise<string>
  update(item: T): Promise<void>
  updateAll(items: T[]): Promise<void>
  delete(id: string): Promise<void>
}
