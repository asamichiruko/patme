import { EntryRepository } from "@/repositories/EntryRepository"
import { StorageService } from "../StorageService"
import { CommentRepository } from "@/repositories/CommentRepository"
import { TagRepository } from "@/repositories/TagRepository"
import type { Entry } from "@/schemas/Entry"
import type { DataStoreAdapter } from "@/adapters/DataStoreAdapter"
import type { ExportedData } from "@/schemas/ExportedData"
import type { Comment } from "@/schemas/Comment"
import type { Tag } from "@/schemas/Tag"
import type { EntryType } from "@/schemas/EntryType"

class MockEntryRepository extends EntryRepository {
  constructor(adapter: DataStoreAdapter<Entry>) {
    super(adapter)
  }
  public get = vi.fn()
  public getAll = vi.fn()
  public countEntriesWithTag = vi.fn()
  public getEntriesWithTag = vi.fn()
  public create = vi.fn()
  public update = vi.fn()
  public delete = vi.fn()
  public restoreAll = vi.fn()
}

class MockCommentRepository extends CommentRepository {
  constructor(adapter: DataStoreAdapter<Comment>) {
    super(adapter)
  }
  public get = vi.fn()
  public getAll = vi.fn()
  public create = vi.fn()
  public update = vi.fn()
  public delete = vi.fn()
  public restoreAll = vi.fn()
}

class MockTagRepository extends TagRepository {
  constructor(adapter: DataStoreAdapter<Tag>) {
    super(adapter)
  }
  public get = vi.fn()
  public getAll = vi.fn()
  public getByTitle = vi.fn()
  public create = vi.fn()
  public update = vi.fn()
  public updateSortOrders = vi.fn()
  public delete = vi.fn()
  public restoreAll = vi.fn()
}

describe("StorageService", () => {
  let service: StorageService
  let mockEntryRepo: MockEntryRepository
  let mockCommentRepo: MockCommentRepository
  let mockTagRepo: MockTagRepository

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    mockEntryRepo = new MockEntryRepository({} as DataStoreAdapter<Entry>)
    mockCommentRepo = new MockCommentRepository({} as DataStoreAdapter<Comment>)
    mockTagRepo = new MockTagRepository({} as DataStoreAdapter<Tag>)
    service = new StorageService(mockEntryRepo, mockCommentRepo, mockTagRepo)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test("新しい entry を作成できる", async () => {
    const body: Omit<Entry, "id" | "createdAt"> = {
      content: "entry 1",
      entryType: "achievement",
      reviewedCount: 0,
      tagIds: [],
    }
    mockEntryRepo.create.mockResolvedValue("entry1")
    const id = await service.createEntry(body)
    expect(mockEntryRepo.create).toHaveBeenCalledWith(body)
    expect(id).toBe("entry1")
  })

  test("entry, comment, tag を紐づけたデータ一覧を取得できる", async () => {
    const entry: Entry = {
      id: "entry1",
      createdAt: new Date().toISOString(),
      content: "entry 1",
      entryType: "achievement",
      reviewedCount: 0,
      tagIds: ["tag1"],
    }
    const comment: Comment = {
      id: "comment1",
      entryId: "entry1",
      createdAt: new Date().toISOString(),
      content: "comment 1",
      reviewType: null,
    }
    const tag: Tag = {
      id: "tag1",
      createdAt: new Date().toISOString(),
      title: "tag 1",
      sortOrder: 0,
    }

    mockEntryRepo.getAll.mockResolvedValue([entry])
    mockCommentRepo.getAll.mockResolvedValue([comment])
    mockTagRepo.getAll.mockResolvedValue([tag])

    const result = await service.getAllEntriesWithRelations()

    expect(result).toEqual([{ ...entry, comments: [comment], tags: [tag] }])
  })

  test("entry.tagIds に含まれる不明な id は紐づけの際スキップされる", async () => {
    const entry: Entry = {
      id: "entry1",
      createdAt: new Date().toISOString(),
      content: "entry 1",
      entryType: "achievement",
      reviewedCount: 0,
      tagIds: ["tag-dummy"],
    }

    mockEntryRepo.getAll.mockResolvedValue([entry])
    mockCommentRepo.getAll.mockResolvedValue([])
    mockTagRepo.getAll.mockResolvedValue([])

    const result = await service.getAllEntriesWithRelations()

    expect(result).toEqual([{ ...entry, comments: [], tags: [] }])
  })

  test("entry にコメントを追加できる", async () => {
    mockEntryRepo.get.mockResolvedValue({ id: "entry1" } as Entry)
    mockCommentRepo.create.mockResolvedValue("comment1")
    const commentBody = {
      content: "comment 1",
      reviewType: null,
    }
    const id = await service.addCommentToEntry("entry1", commentBody)
    expect(mockCommentRepo.create).toHaveBeenCalledWith({ ...commentBody, entryId: "entry1" })
    expect(id).toBe("comment1")
  })

  test("すべての tags を取得できる", async () => {
    const tags: Tag[] = [
      {
        id: "tag1",
        title: "tag 1",
        createdAt: new Date().toISOString(),
        sortOrder: 0,
      },
      {
        id: "tag2",
        title: "tag 2",
        createdAt: new Date().toISOString(),
        sortOrder: 1,
      },
    ]
    mockTagRepo.getAll.mockResolvedValue(tags)
    const allTags = await service.getAllTags()
    expect(allTags).toEqual(tags)
  })

  test("title から tag を取得できる", async () => {
    const existing = {
      id: "id1",
      title: "tag 1",
      createdAt: new Date().toISOString(),
      sortOrder: 0,
    }
    mockTagRepo.getByTitle.mockResolvedValue(existing)
    const tag = await service.getTagByTitle("tag 1")
    expect(tag).toEqual(existing)
  })

  test("新規 tag を作成できる", async () => {
    const tagBody = { title: "tag 1" }
    mockTagRepo.create.mockResolvedValue("tag1")
    const id = await service.createTag(tagBody)
    expect(mockTagRepo.create).toHaveBeenCalledWith(tagBody)
    expect(id).toBe("tag1")
  })

  test("tag を持つ Entry の数を取得できる", async () => {
    await service.countEntriesWithTag("tag1")
    expect(mockEntryRepo.countEntriesWithTag).toHaveBeenCalledWith("tag1")
  })

  test("tag を 削除できる", async () => {
    const entries: Entry[] = [
      {
        id: "entry1",
        createdAt: new Date().toISOString(),
        content: "entry 1",
        entryType: "achievement",
        reviewedCount: 0,
        tagIds: ["tag1"],
      },
      {
        id: "entry2",
        createdAt: new Date().toISOString(),
        content: "entry 2",
        entryType: "achievement",
        reviewedCount: 0,
        tagIds: ["tag2"],
      },
    ]
    mockEntryRepo.getEntriesWithTag.mockResolvedValue(entries)
    await service.deleteTagAndDetachFromEntries("tag1")
    expect(mockEntryRepo.update).toHaveBeenCalledWith({
      ...entries[0],
      tagIds: [],
    })
    expect(mockTagRepo.delete).toHaveBeenCalledWith("tag1")
  })

  test("tag の並び順を更新できる", async () => {
    const tags: Tag[] = [
      {
        id: "tag2",
        title: "tag 2",
        createdAt: new Date().toISOString(),
        sortOrder: 1,
      },
      {
        id: "tag1",
        title: "tag 1",
        createdAt: new Date().toISOString(),
        sortOrder: 0,
      },
    ]
    await service.reorderTags(tags)
    expect(mockTagRepo.updateSortOrders).toHaveBeenCalledWith(tags)
  })

  test("すべてのデータを復元できる", async () => {
    const data: ExportedData = {
      version: 1,
      entries: [
        {
          id: "entry1",
          createdAt: new Date().toISOString(),
          content: "entry 1",
          entryType: "achievement" as EntryType,
          reviewedCount: 0,
          tagIds: ["tag1"],
        },
      ],
      comments: [
        {
          id: "comment1",
          entryId: "entry1",
          createdAt: new Date().toISOString(),
          content: "comment 1",
          reviewType: null,
        },
      ],
      tags: [
        {
          id: "tag1",
          title: "tag 1",
          createdAt: new Date().toISOString(),
          sortOrder: 0,
        },
      ],
    }

    await service.restoreAllData(data)
    expect(mockEntryRepo.restoreAll).toHaveBeenCalledWith(data.entries)
    expect(mockCommentRepo.restoreAll).toHaveBeenCalledWith(data.comments)
    expect(mockTagRepo.restoreAll).toHaveBeenCalledWith(data.tags)
  })
})
