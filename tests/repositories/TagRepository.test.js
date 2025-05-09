import { TagRepository } from "@/repositories/TagRepository.js"

describe("TagRepository.js", () => {
  let mockStorage
  let tagRepos

  const testTags = [
    {
      id: "tag1",
      title: "tag 1",
      order: 1,
    },
    {
      id: "tag2",
      title: "tag 2",
      order: 2,
    },
    {
      id: "tag3",
      title: "tag 3",
      order: 3,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockStorage = {
      load: vi.fn(() => []),
      has: vi.fn(() => true),
      save: vi.fn(),
    }
    tagRepos = new TagRepository(mockStorage)
  })

  test("storage へ tag を追加できる", () => {
    tagRepos.add(testTags[0])
    expect(mockStorage.save).toHaveBeenCalledWith(tagRepos.key, [testTags[0]])
  })

  test("getAll ですべての tags を取得できる", () => {
    mockStorage.load.mockReturnValue(testTags)
    const result = tagRepos.getAll()
    expect(result).toEqual(testTags)
  })

  test("getAll で空の storage から空の配列を取得する", () => {
    const result = tagRepos.getAll()
    expect(result).toEqual([])
  })

  test("findByTitle で title から tag を取得できる", () => {
    mockStorage.load.mockReturnValue(testTags)
    const result = tagRepos.findByTitle("tag 1")
    expect(result).toEqual(testTags[0])
  })

  test("findByTitle で存在しない title から null を取得する", () => {
    mockStorage.load.mockReturnValue(testTags)
    const result = tagRepos.findByTitle("tag 1")
    expect(result).toEqual(testTags[0])
  })

  test("updateAll により指定した tag で全体が保存される", () => {
    tagRepos.updateAll(testTags)
    expect(mockStorage.save).toHaveBeenCalledWith(tagRepos.key, testTags)
  })
})
