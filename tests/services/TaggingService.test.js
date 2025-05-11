import { TaggingService } from "@/services/TaggingService.js"

describe("TaggingService.js", () => {
  let taggingService
  let mockEntryRepository, mockTagRepository, mockTaggingRepository
  const testTaggings = [
    {
      achievementId: "0b3df1d5-eb66-4dd4-b9c9-08f01555bcf1",
      tagId: "6e971677-ebbe-49b1-a0a9-23d4fb962301",
    },
    {
      achievementId: "0b3df1d5-eb66-4dd4-b9c9-08f01555bcf1",
      tagId: "d7aee519-c00e-41e8-9b22-5f2ee0c00019",
    },
    {
      achievementId: "0b3df1d5-eb66-4dd4-b9c9-08f01555bcf1",
      tagId: "5b9a5917-43a8-47a0-8f34-bc3bba96bb01",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockEntryRepository = {
      hasAchievement: vi.fn(),
    }

    mockTagRepository = {
      has: vi.fn(),
      getAll: vi.fn(() => []),
    }

    mockTaggingRepository = {
      add: vi.fn(),
      has: vi.fn(),
      getAll: vi.fn(() => []),
      findByAchievementId: vi.fn(),
      remove: vi.fn(),
    }

    taggingService = new TaggingService({
      entryRepository: mockEntryRepository,
      tagRepository: mockTagRepository,
      taggingRepository: mockTaggingRepository,
    })
  })

  test("addTagging で tagging を追加される", () => {
    mockTagRepository.has.mockReturnValue(true)
    mockEntryRepository.hasAchievement.mockReturnValue(true)
    mockTaggingRepository.has.mockReturnValue(false)

    const result = taggingService.addTagging(testTaggings[0])

    expect(mockTaggingRepository.add).toHaveBeenCalledWith(testTaggings[0])
    expect(result).toEqual(testTaggings[0])
  })

  test("getTaggings が taggingRepository.getAll に移譲される", () => {
    taggingService.getTaggings()
    expect(mockTaggingRepository.getAll).toHaveBeenCalled()
  })

  test("updateTaggings で taggingRepository.add と remove が適切に呼ばれる", () => {
    mockTagRepository.has.mockReturnValue(true)
    mockEntryRepository.hasAchievement.mockReturnValue(true)

    mockTaggingRepository.findByAchievementId.mockReturnValue([testTaggings[0], testTaggings[1]])
    taggingService.updateTaggings(testTaggings[0].achievementId, [
      testTaggings[1].tagId,
      testTaggings[2].tagId,
    ])

    expect(mockTaggingRepository.add).toHaveBeenCalledWith(testTaggings[2])
    expect(mockTaggingRepository.remove).toHaveBeenCalledWith(testTaggings[0])
  })

  test("removeTagging で tagging が削除される", () => {
    taggingService.removeTagging(testTaggings[0])

    expect(mockTaggingRepository.remove).toHaveBeenCalledWith(testTaggings[0])
  })
})
