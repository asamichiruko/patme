import type { DataStoreAdapter } from "@/adapters/DataStoreAdapter"
import { EntryRepository } from "../EntryRepository"
import { type Entry } from "@/schemas/Entry"

describe("EntryRepository", () => {
  const mockAdapter = {
    get: vi.fn(),
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateAll: vi.fn(),
    delete: vi.fn(),
    restoreAll: vi.fn(),
  } satisfies DataStoreAdapter<Entry>

  let repo: EntryRepository

  beforeEach(() => {
    repo = new EntryRepository(mockAdapter)
    vi.clearAllMocks()
  })

  test("全 entry を取得できる", async () => {
    const entry1 = {
      id: "id1",
      createdAt: new Date().toISOString(),
      content: "content 1",
      entryType: "achievement",
      isReviewed: false,
      tagIds: [],
    }
    const entry2 = {
      id: "id2",
      createdAt: new Date().toISOString(),
      content: "content 2",
      entryType: "achievement",
      isReviewed: false,
      tagIds: [],
    }
    mockAdapter.getAll.mockResolvedValue([entry1, entry2])
    const entries = await repo.getAll()
    expect(entries[0].id).toEqual(entry1.id)
    expect(entries[1].id).toEqual(entry2.id)
  })

  test("存在する entry を取得できる", async () => {
    const existing = {
      id: "id1",
      createdAt: new Date().toISOString(),
      content: "content 1",
      entryType: "incomplete",
      isReviewed: true,
      tagIds: ["tag1", "tag2"],
    }
    mockAdapter.get.mockResolvedValue(existing)
    const entry = await repo.get("id1")
    expect(entry!.id).toBe(existing.id)
    expect(entry!.createdAt).toBe(existing.createdAt)
    expect(entry!.content).toBe(existing.content)
    expect(entry!.entryType).toBe(existing.entryType)
    expect(entry!.isReviewed).toBe(existing.isReviewed)
    expect(entry!.tagIds).toEqual(existing.tagIds)
  })

  test("取得しようとした id が存在しなかった場合 null が返る", async () => {
    mockAdapter.get.mockResolvedValue(null)
    const entry = await repo.get("id1")
    expect(entry).toBeNull()
  })

  test("tagId を持つ entries の数を取得できる", async () => {
    mockAdapter.getAll.mockResolvedValue([
      {
        id: "id1",
        createdAt: new Date().toISOString(),
        content: "content 1",
        entryType: "achievement",
        isReviewed: false,
        tagIds: ["tag1", "tag2"],
      },
      {
        id: "id2",
        createdAt: new Date().toISOString(),
        content: "content 2",
        entryType: "achievement",
        isReviewed: false,
        tagIds: [],
      },
    ])
    const count = await repo.countEntriesWithTag("tag2")
    expect(count).toBe(1)
  })

  test("tagId を持つ entries を取得できる", async () => {
    mockAdapter.getAll.mockResolvedValue([
      {
        id: "id1",
        createdAt: new Date().toISOString(),
        content: "content 1",
        entryType: "achievement",
        isReviewed: false,
        tagIds: ["tag1", "tag2"],
      },
      {
        id: "id2",
        createdAt: new Date().toISOString(),
        content: "content 2",
        entryType: "achievement",
        isReviewed: false,
        tagIds: [],
      },
    ])
    const entries = await repo.getEntriesWithTag("tag2")
    expect(entries).toHaveLength(1)
    expect(entries[0].id).toBe("id1")
  })

  test("新規 entry を追加できる", async () => {
    mockAdapter.create.mockResolvedValue("id1")
    const entryBody: Omit<Entry, "id" | "createdAt"> = {
      content: "content 1",
      entryType: "achievement",
      isReviewed: false,
      tagIds: [],
    }
    const id = await repo.create(entryBody)
    expect(mockAdapter.create).toHaveBeenCalledWith({
      ...entryBody,
      createdAt: expect.any(String),
    })
    expect(id).toBe("id1")
  })

  test("既存 entry を更新できる", async () => {
    const oldEntry: Entry = {
      id: "id1",
      createdAt: new Date().toISOString(),
      content: "old content",
      entryType: "achievement",
      isReviewed: false,
      tagIds: [],
    }
    const newEntry: Entry = {
      ...oldEntry,
      content: "new content",
    }

    await repo.update(newEntry)
    expect(mockAdapter.update).toHaveBeenCalledWith(newEntry)
  })

  test("entry を削除できる", async () => {
    await repo.delete("id1")
    expect(mockAdapter.delete).toHaveBeenCalledWith("id1")
  })

  test("データをすべて復元できる", async () => {
    const data: Entry[] = [
      {
        id: "id1",
        createdAt: new Date().toISOString(),
        content: "content 1",
        entryType: "achievement",
        isReviewed: false,
        tagIds: [],
      },
      {
        id: "id2",
        createdAt: new Date().toISOString(),
        content: "content 2",
        entryType: "achievement",
        isReviewed: false,
        tagIds: ["tag1, tag2"],
      },
    ]
    await repo.restoreAll(data)
    expect(mockAdapter.restoreAll).toHaveBeenCalledWith(data)
  })
})
