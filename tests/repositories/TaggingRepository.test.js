import { TaggingRepository } from "@/repositories/TaggingRepository.js"

describe("TaggingRepository.js", () => {
  let mockStorage
  let taggingRepos

  const testTaggings = [
    {
      achievementId: "a-id1",
      tagId: "t-id1",
    },
    {
      achievementId: "a-id2",
      tagId: "t-id1",
    },
    {
      achievementId: "a-id2",
      tagId: "t-id2",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockStorage = {
      load: vi.fn(() => []),
      has: vi.fn(() => true),
      save: vi.fn(),
    }
    taggingRepos = new TaggingRepository(mockStorage)
  })

  test("storage へ tagging を追加できる", () => {
    taggingRepos.add(testTaggings[0])
    expect(mockStorage.save).toHaveBeenCalledWith(taggingRepos.key, [testTaggings[0]])
  })

  test("storage にある tagging をすべて取得できる", () => {
    mockStorage.load.mockReturnValue(testTaggings)
    const taggings = taggingRepos.getAll()
    expect(taggings).toHaveLength(3)
    expect(taggings).toContain(testTaggings[0])
    expect(taggings).toContain(testTaggings[1])
    expect(taggings).toContain(testTaggings[2])
  })

  test("空の storage から getAll すると空の配列が得られる", () => {
    const taggings = taggingRepos.getAll()
    expect(taggings).toEqual([])
  })

  test("storage 内に tagging が存在するとき has が true を返す", () => {
    mockStorage.load.mockReturnValue(testTaggings)
    const result = taggingRepos.has(testTaggings[0])
    expect(result).toBe(true)
  })

  test("storage 内に tagging が存在しないとき has が false を返す", () => {
    const result = taggingRepos.has(testTaggings[0])
    expect(result).toBe(false)
  })

  test("achievementId に紐づく taggings を取得できる", () => {
    mockStorage.load.mockReturnValue(testTaggings)
    const result = taggingRepos.findByAchievementId("a-id1")
    expect(result).toEqual([testTaggings[0]])
  })

  test("achievementId に紐づく tagging がないとき空配列を取得する", () => {
    mockStorage.load.mockReturnValue(testTaggings)
    const result = taggingRepos.findByAchievementId("a-id3")
    expect(result).toEqual([])
  })

  test("tagId に紐づく taggings を取得できる", () => {
    mockStorage.load.mockReturnValue(testTaggings)
    const result = taggingRepos.findByTagId("t-id2")
    expect(result).toEqual([testTaggings[2]])
  })

  test("tagId に紐づく tagging がないとき空配列を取得する", () => {
    mockStorage.load.mockReturnValue(testTaggings)
    const result = taggingRepos.findByAchievementId("t-id3")
    expect(result).toEqual([])
  })

  test("updateAll に与えた taggings のみで save される", () => {
    taggingRepos.updateAll(testTaggings)
    expect(mockStorage.save).toHaveBeenCalledWith(taggingRepos.key, testTaggings)
  })

  test("指定した tagging を remove できる", () => {
    mockStorage.load.mockReturnValue([testTaggings[0], testTaggings[1]])
    taggingRepos.remove(testTaggings[0])
    expect(mockStorage.save).toHaveBeenCalledWith(taggingRepos.key, [testTaggings[1]])
  })

  test("指定した tagging が存在しない場合はデータを削除しない", () => {
    mockStorage.load.mockReturnValue([testTaggings[0], testTaggings[1]])
    taggingRepos.remove(testTaggings[2])
    expect(mockStorage.save).toHaveBeenCalledWith(taggingRepos.key, [
      testTaggings[0],
      testTaggings[1],
    ])
  })
})
