const testIds = ["a3e79cc2-c06c-4034-b3b1-cbd25b327c9d"]

vi.mock("@/utils/idUtils.js", () => ({
  isValidId: vi.fn(() => true),
  generateId: vi.fn(() => testIds[0]),
}))

import { TagService } from "@/services/TagService.js"

describe("TagService.js", () => {
  let tagService
  let mockTagRepository, mockTaggingRepository

  const testTags = [
    {
      id: "0b3df1d5-eb66-4dd4-b9c9-08f01555bcf1",
      title: "tag 1",
      order: 1,
    },
    {
      id: "5b9a5917-43a8-47a0-8f34-bc3bba96bb01",
      title: "tag 2",
      order: 2,
    },
    {
      id: "e2bd92e0-5b57-4b84-9307-a49ec5518bce",
      title: "tag 3",
      order: 3,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockTagRepository = {
      add: vi.fn(),
      getAll: vi.fn(() => []),
      findByTitle: vi.fn(),
      updateAll: vi.fn(),
    }

    mockTaggingRepository = {
      getAll: vi.fn(() => []),
    }

    tagService = new TagService({
      tagRepository: mockTagRepository,
      taggingRepository: mockTaggingRepository,
    })
  })

  test("addTag で正常にタグを追加できる", () => {
    mockTagRepository.findByTitle.mockReturnValue(null)

    const result = tagService.addTag({ id: testTags[0], title: testTags[0] })

    expect(result).toEqual({ id: testTags[0], title: testTags[0], order: 1 })
    expect(mockTagRepository.add).toHaveBeenCalledWith(result)
  })

  test("addTag で id を省略できる", () => {
    mockTagRepository.findByTitle.mockReturnValue(null)

    const result = tagService.addTag({ title: testTags[0] })

    expect(result).toEqual({ id: testIds[0], title: testTags[0], order: 1 })
    expect(mockTagRepository.add).toHaveBeenCalledWith(result)
  })

  test("addTag で追加したタグの order が唯一の最大値となる", () => {
    mockTagRepository.findByTitle.mockReturnValue(null)
    mockTagRepository.getAll.mockReturnValue([testTags[2], testTags[0]])

    const result = tagService.addTag({ title: testTags[1] })

    expect(result).toEqual({ id: testIds[0], title: testTags[1], order: testTags[2].order + 1 })
    expect(mockTagRepository.add).toHaveBeenCalledWith(result)
  })

  test("getTagsOrdered で order 順にタグを取得できる", () => {
    mockTagRepository.getAll.mockReturnValue([testTags[2], testTags[0], testTags[1]])

    const result = tagService.getTagsOrdered()

    expect(result).toEqual([testTags[0], testTags[1], testTags[2]])
  })

  test("reorderTagByIds でタグの順序を正常に並び替えられる", () => {
    mockTagRepository.getAll.mockReturnValue([testTags[2], testTags[0], testTags[1]])

    tagService.reorderTagByIds([testTags[1].id, testTags[2].id, testTags[0].id])

    expect(mockTagRepository.updateAll).toHaveBeenCalledWith([
      testTags[1],
      testTags[2],
      testTags[0],
    ])
  })
})
