import { ExportService } from "@/services/ExportService.js"

describe("ExportService.js", () => {
  let exportService
  let mockEntryService, mockTagService, mockTaggingService

  const testAchievements = [
    {
      id: "achievenemt1",
      content: "achievement 1",
      entryType: "achievement",
      isReviewed: false,
      date: new Date("2025-04-01"),
    },
  ]

  const testStars = [
    {
      id: "star1",
      achievementId: "achievement1",
      content: "star 1",
      reviewType: null,
      date: new Date("2025-04-01"),
    },
  ]

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
  ]

  const testTaggings = [
    {
      achievementId: "achievement1",
      tagId: "tag1",
    },
    {
      achievementId: "achievement1",
      tagId: "tag2",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockEntryService = {
      getAchievements: vi.fn(() => []),
      getStars: vi.fn(() => []),
    }

    mockTagService = {
      getTagsOrdered: vi.fn(() => []),
    }

    mockTaggingService = {
      getTaggings: vi.fn(() => []),
    }

    exportService = new ExportService({
      entryService: mockEntryService,
      tagService: mockTagService,
      taggingService: mockTaggingService,
    })
  })

  test("exportData ですべてのデータが export される", () => {
    mockEntryService.getAchievements.mockReturnValue(testAchievements)
    mockEntryService.getStars.mockReturnValue(testStars)
    mockTagService.getTagsOrdered.mockReturnValue(testTags)
    mockTaggingService.getTaggings.mockReturnValue(testTaggings)

    const result = exportService.exportData()

    expect(result).toEqual({
      achievements: testAchievements,
      stars: testStars,
      tags: testTags,
      taggings: testTaggings,
    })
  })

  test("データが空のとき空配列の構造で export される", () => {
    const result = exportService.exportData()

    expect(result).toEqual({
      achievements: [],
      stars: [],
      tags: [],
      taggings: [],
    })
  })

  test("exportData で得られるトップレベルキーが適切である", () => {
    const result = exportService.exportData()

    expect(Object.keys(result)).toEqual(["achievements", "stars", "tags", "taggings"])
  })
})
