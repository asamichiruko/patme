import type { DataStoreAdapter } from "@/types"
import { CommentRepository } from "../CommentRepository"
import { type Comment } from "@/schemas/Comment"

describe("CommentRepository", async () => {
  const mockAdapter = {
    get: vi.fn(),
    getAll: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    updateAll: vi.fn(),
    delete: vi.fn(),
  } satisfies DataStoreAdapter<Comment>

  let repo: CommentRepository

  beforeEach(() => {
    repo = new CommentRepository(mockAdapter)
    vi.clearAllMocks()
  })

  test("全 comment を取得できる", async () => {
    const comment1 = {
      id: "id1",
      entryId: "entryId1",
      createdAt: new Date().toISOString(),
      content: "content 1",
      reviewType: "achievement",
    }
    const comment2 = {
      id: "id2",
      entryId: "entryId1",
      createdAt: new Date().toISOString(),
      content: "content 2",
      reviewType: "achievement",
    }
    mockAdapter.getAll.mockResolvedValue([comment1, comment2])
    const comments = await repo.getAll()
    expect(comments[0].id).toEqual(comment1.id)
    expect(comments[1].id).toEqual(comment2.id)
  })

  test("存在する comment を取得できる", async () => {
    const existing = {
      id: "id1",
      entryId: "entryId1",
      createdAt: new Date().toISOString(),
      content: "content 1",
      reviewType: "achievement",
    }
    mockAdapter.get.mockResolvedValue(existing)
    const comment = await repo.get("id1")
    expect(comment!.id).toBe(existing.id)
    expect(comment!.entryId).toBe(existing.entryId)
    expect(comment!.createdAt).toBe(existing.createdAt)
    expect(comment!.content).toBe(existing.content)
    expect(comment!.reviewType).toBe(existing.reviewType)
  })

  test("取得しようとした id が存在しなかった場合 null が返る", async () => {
    mockAdapter.get.mockResolvedValue(null)
    const comment = await repo.get("id1")
    expect(comment).toBeNull()
  })

  test("新規 comment を追加できる", async () => {
    mockAdapter.add.mockResolvedValue("id1")
    const commentBody: Omit<Comment, "id" | "createdAt"> = {
      entryId: "entryId1",
      content: "content 1",
      reviewType: "achievement",
    }
    const id = await repo.add(commentBody)
    expect(mockAdapter.add).toHaveBeenCalledWith({
      ...commentBody,
      createdAt: expect.any(String),
    })
    expect(id).toBe("id1")
  })

  test("既存 comment を更新できる", async () => {
    const oldComment: Comment = {
      id: "id1",
      entryId: "entryId1",
      createdAt: new Date().toISOString(),
      content: "old content",
      reviewType: "achievement",
    }
    const newComment: Comment = {
      ...oldComment,
      content: "new content",
    }

    await repo.update(newComment)
    expect(mockAdapter.update).toHaveBeenCalledWith(newComment)
  })

  test("comment を削除できる", async () => {
    await repo.delete("id1")
    expect(mockAdapter.delete).toHaveBeenCalledWith("id1")
  })
})
