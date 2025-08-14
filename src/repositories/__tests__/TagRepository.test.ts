import type { DataStoreAdapter } from "@/types"
import { TagRepository } from "../TagRepository"
import { type Tag } from "@/schemas/Tag"

describe("TagRepository", () => {
  const mockAdapter = {
    get: vi.fn(),
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateAll: vi.fn(),
    delete: vi.fn(),
    restoreAll: vi.fn(),
  } satisfies DataStoreAdapter<Tag>

  let repo: TagRepository

  beforeEach(() => {
    repo = new TagRepository(mockAdapter)
    vi.clearAllMocks()
  })

  test("全 tag を取得できる", async () => {
    const tag1 = {
      id: "id1",
      createdAt: new Date().toISOString(),
      title: "title 1",
      sortOrder: 0,
    }
    const tag2 = {
      id: "id2",
      createdAt: new Date().toISOString(),
      title: "title 2",
      sortOrder: 1,
    }
    mockAdapter.getAll.mockResolvedValue([tag1, tag2])
    const tags = await repo.getAll()
    expect(tags[0].id).toEqual(tag1.id)
    expect(tags[1].id).toEqual(tag2.id)
  })

  test("存在する tag を取得できる", async () => {
    const existing = {
      id: "id1",
      createdAt: new Date().toISOString(),
      title: "title 1",
      sortOrder: 0,
    }
    mockAdapter.get.mockResolvedValue(existing)
    const tag = await repo.get("id1")
    expect(tag!.id).toBe(existing.id)
    expect(tag!.createdAt).toBe(existing.createdAt)
    expect(tag!.title).toBe(existing.title)
    expect(tag!.sortOrder).toBe(existing.sortOrder)
  })

  test("取得しようとした id が存在しなかった場合 null が返る", async () => {
    mockAdapter.get.mockResolvedValue(null)
    const tag = await repo.get("id1")
    expect(tag).toBeNull()
  })

  test("tag を title から取得できる", async () => {
    const existing = {
      id: "id1",
      createdAt: new Date().toISOString(),
      title: "title 1",
      sortOrder: 0,
    }
    mockAdapter.getAll.mockResolvedValue([existing])
    const tag = await repo.getByTitle("title 1")
    expect(tag!.id).toBe(existing.id)
    expect(tag!.createdAt).toBe(existing.createdAt)
    expect(tag!.title).toBe(existing.title)
    expect(tag!.sortOrder).toBe(existing.sortOrder)
  })

  test("tag を title から取得しようとしたとき title が存在しなかった場合 null が返る", async () => {
    mockAdapter.getAll.mockResolvedValue([])
    const tag = await repo.getByTitle("dummy-title")
    expect(tag).toBeNull()
  })

  test("新規 tag を追加できる", async () => {
    mockAdapter.getAll.mockResolvedValue([
      {
        id: "id1",
        createdAt: new Date().toISOString(),
        title: "title 1",
        sortOrder: 0,
      },
    ])

    mockAdapter.create.mockResolvedValue("id2")
    const tagBody: Omit<Tag, "id" | "createdAt" | "sortOrder"> = {
      title: "title 2",
    }
    const id = await repo.create(tagBody)
    expect(mockAdapter.create).toHaveBeenCalledWith({
      ...tagBody,
      createdAt: expect.any(String),
      sortOrder: 1,
    })
    expect(id).toBe("id2")
  })

  test("既存 tag を更新できる", async () => {
    const oldTag: Tag = {
      id: "id1",
      createdAt: new Date().toISOString(),
      title: "old title",
      sortOrder: 0,
    }
    const newTag: Tag = {
      ...oldTag,
      title: "new title",
    }

    mockAdapter.getAll.mockResolvedValue([oldTag])
    await repo.update(newTag)
    expect(mockAdapter.update).toHaveBeenCalledWith(newTag)
  })

  test("sortOrder を振り直せる", async () => {
    const tag1 = {
      id: "id1",
      createdAt: new Date().toISOString(),
      title: "title 1",
      sortOrder: 0,
    }
    const tag2 = {
      id: "id2",
      createdAt: new Date().toISOString(),
      title: "title 2",
      sortOrder: 1,
    }

    await repo.updateSortOrders([tag2, tag1])
    expect(mockAdapter.updateAll).toHaveBeenCalledWith([
      { ...tag2, sortOrder: 0 },
      { ...tag1, sortOrder: 1 },
    ])
  })

  test("tag を削除できる", async () => {
    const tag1 = {
      id: "id1",
      createdAt: new Date().toISOString(),
      title: "title 1",
      sortOrder: 0,
    }
    // tag2 will delete
    const tag3 = {
      id: "id3",
      createdAt: new Date().toISOString(),
      title: "title 3",
      sortOrder: 2,
    }
    mockAdapter.getAll.mockResolvedValue([tag1, tag3])

    await repo.delete("id2")
    expect(mockAdapter.delete).toHaveBeenCalledWith("id2")
    expect(mockAdapter.updateAll).toHaveBeenCalledWith([
      { ...tag1, sortOrder: 0 },
      { ...tag3, sortOrder: 1 },
    ])
  })

  test("データをすべて復元できる", async () => {
    const data: Tag[] = [
      {
        id: "id1",
        createdAt: new Date().toISOString(),
        title: "title 1",
        sortOrder: 0,
      },
      {
        id: "id2",
        createdAt: new Date().toISOString(),
        title: "title 2",
        sortOrder: 1,
      },
    ]
    await repo.restoreAll(data)
    expect(mockAdapter.restoreAll).toHaveBeenCalledWith(data)
  })
})
