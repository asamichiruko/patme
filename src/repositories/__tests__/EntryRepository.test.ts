import type { DataStoreAdapter, EntryBody } from "@/types"
import { EntryRepository } from "../EntryRepository"

describe("EntryRepository", () => {
  const mockAdapter = {
    getAll: vi.fn(),
    get: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    generateId: vi.fn(),
    serializeDate: vi.fn(),
    deserializeDate: vi.fn(),
  } satisfies DataStoreAdapter

  let repo: EntryRepository

  beforeEach(() => {
    repo = new EntryRepository(mockAdapter)
    vi.clearAllMocks()
  })

  test("全 entry を取得できる", async () => {
    const obj1 = { id: "id1" }
    const obj2 = { id: "id2" }
    mockAdapter.getAll.mockResolvedValue([obj1, obj2])
    const entries = await repo.getAll()
    expect(entries[0].id).toEqual(obj1.id)
    expect(entries[1].id).toEqual(obj2.id)
  })

  test("存在する entry を取得できる", async () => {
    const obj1 = {
      id: "id1",
      createdAt: new Date().toISOString(),
      content: "content 1",
      entryType: "incomplete",
      isReviewed: true,
      tagIds: ["tag1", "tag2"],
    }
    mockAdapter.get.mockResolvedValue(obj1)
    const entry = await repo.get("id1")
    expect(entry!.id).toBe("id1")
    expect(entry!.createdAt).toBeInstanceOf(Date)
    expect(entry!.content).toBe("content 1")
    expect(entry!.entryType).toBe("incomplete")
    expect(entry!.isReviewed).toBe(true)
    expect(entry!.tagIds).toEqual(["tag1", "tag2"])
  })

  test("不完全な entry を get するとデフォルト値で補完される", async () => {
    const obj1 = { id: "id1" }
    mockAdapter.get.mockResolvedValue(obj1)
    const entry = await repo.get("id1")
    expect(entry!.id).toBe("id1")
    expect(entry!.createdAt).toBeInstanceOf(Date)
    expect(entry!.content).toBe("")
    expect(entry!.entryType).toBe("achievement")
    expect(entry!.isReviewed).toBe(false)
    expect(entry!.tagIds).toEqual([])
  })

  test("取得しようとした entryId が存在しなかった場合 null が返る", async () => {
    mockAdapter.get.mockResolvedValue(null)
    const entry = await repo.get("id1")
    expect(entry).toBeNull()
  })

  test("新規 entry を追加できる", async () => {
    mockAdapter.add.mockResolvedValue("id1")
    const entryBody: EntryBody = {
      content: "content 1",
      entryType: "achievement",
      isReviewed: false,
      tagIds: [],
    }
    const id = await repo.add(entryBody)
    expect(mockAdapter.add).toHaveBeenCalledWith(entryBody)
    expect(id).toBe("id1")
  })

  test("不完全な EntryBody で add するとデフォルト値で補完される", async () => {
    await repo.add({} as EntryBody)
    expect(mockAdapter.add).toHaveBeenCalledWith({
      content: "",
      entryType: "achievement",
      isReviewed: false,
      tagIds: [],
    })
  })

  test("既存 entry を更新できる", async () => {
    const entryBody: EntryBody = {
      content: "content 1",
      entryType: "achievement",
      isReviewed: false,
      tagIds: [],
    }
    await repo.update("id1", entryBody)
    expect(mockAdapter.update).toHaveBeenCalledWith("id1", entryBody)
  })

  test("entry を削除できる", async () => {
    await repo.delete("id1")
    expect(mockAdapter.delete).toHaveBeenCalledWith("id1")
  })
})
