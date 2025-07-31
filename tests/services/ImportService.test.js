import { ImportService } from "@/services/ImportService.js"

describe("ImportService.js", () => {
  let importService
  let mockEntryService, mockTagService, mockTaggingService

  const testAchievements = [
    {
      id: "89bd5913-48f2-4156-8357-7997086471ac",
      content: "achievement 1",
      entryType: "achievement",
      isReviewed: false,
      date: new Date("2025-04-01T15:00:00"),
    },
    {
      id: "c642d255-7837-41e9-80d2-13e4f203fd3b",
      content: "achievement 2",
      entryType: "achievement",
      isReviewed: false,
      date: new Date("2025-04-01T14:00:00"),
    },
  ]
  const testStars = [
    {
      id: "d0a7ae51-8f44-4b59-b97e-0a6a3fdf3ab5",
      achievementId: "89bd5913-48f2-4156-8357-7997086471ac",
      content: "star 1 (for achievement 1)",
      reviewType: null,
      date: new Date("2025-04-01T15:10:00"),
    },
    {
      id: "faaf37db-401d-46df-80d0-54b4257bbb16",
      achievementId: "89bd5913-48f2-4156-8357-7997086471ac",
      content: "star 2 (for achievement 1)",
      reviewType: null,
      date: new Date("2025-04-01T15:20:00"),
    },
  ]
  const testTags = [
    {
      id: "686c22a6-7256-4ea8-bb12-00fd284b3473",
      title: "tag 1",
      order: 1,
    },
    {
      id: "34acd149-796f-4fdc-921e-fb7fc37dbc1c",
      title: "tag 2",
      order: 2,
    },
    {
      id: "c8e663bf-84d1-4943-bfa9-130a9b47d3d6",
      title: "tag 1", // tags[0] と衝突する
      order: 1,
    },
    {
      id: "f75885d6-df99-4185-a275-d722a3124065",
      title: "tag 3",
      order: 3,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockEntryService = {
      addAchievement: vi.fn((achievement) => achievement),
      addStar: vi.fn((star) => star),
      getAchievements: vi.fn(() => []),
      getStars: vi.fn(() => []),
    }

    mockTagService = {
      addTag: vi.fn((tag) => tag),
      getTagsOrdered: vi.fn(() => []),
    }

    mockTaggingService = {
      addTagging: vi.fn((tagging) => tagging),
    }

    importService = new ImportService({
      entryService: mockEntryService,
      tagService: mockTagService,
      taggingService: mockTaggingService,
    })
  })

  test("既存の達成事項と重複しない新規データが追加される", () => {
    mockEntryService.getAchievements.mockReturnValue([])
    const result = importService.importData({
      achievements: [testAchievements[0]],
      stars: [],
      tags: [],
      taggings: [],
    })

    expect(result.achievements.added).toHaveLength(1)
    expect(result.achievements.rejected).toHaveLength(0)
    expect(mockEntryService.addAchievement).toHaveBeenCalledWith(testAchievements[0])
  })

  test("既存の達成事項が重複する新規データが破棄される", () => {
    mockEntryService.getAchievements.mockReturnValue([testAchievements[0]])
    const result = importService.importData({
      achievements: [testAchievements[0]],
      stars: [],
      tags: [],
      taggings: [],
    })

    expect(result.achievements.added).toHaveLength(0)
    expect(result.achievements.rejected).toHaveLength(1)
  })

  test("既存のコメントと重複しない新規データが追加される", () => {
    mockEntryService.getAchievements.mockReturnValue([testAchievements[0]])
    mockEntryService.getStars.mockReturnValue([])
    const result = importService.importData({
      achievements: [],
      stars: [testStars[0]],
      tags: [],
      taggings: [],
    })

    expect(result.stars.added).toHaveLength(1)
    expect(result.stars.rejected).toHaveLength(0)
    expect(mockEntryService.addStar).toHaveBeenCalledWith(testStars[0])
  })

  test("既存のコメントと重複する新規データが破棄される", () => {
    mockEntryService.getAchievements.mockReturnValue([testAchievements[0]])
    mockEntryService.getStars.mockReturnValue([testStars[0]])
    const result = importService.importData({
      achievements: [],
      stars: [testStars[0]],
      tags: [],
      taggings: [],
    })

    expect(result.stars.added).toHaveLength(0)
    expect(result.stars.rejected).toHaveLength(1)
  })

  test("対応する達成事項が存在しない新規データが破棄される", () => {
    mockEntryService.getAchievements.mockReturnValue([])
    mockEntryService.getStars.mockReturnValue([])
    const result = importService.importData({
      achievements: [],
      stars: [testStars[0]],
      tags: [],
      taggings: [],
    })

    expect(result.stars.added).toHaveLength(0)
    expect(result.stars.rejected).toHaveLength(1)
  })

  test("既存のタグと重複しない新規データが追加される", () => {
    mockTagService.getTagsOrdered.mockReturnValue([])
    const result = importService.importData({
      achievements: [],
      stars: [],
      tags: [testTags[0]],
      taggings: [],
    })

    expect(result.tags.added).toHaveLength(1)
    expect(result.tags.rejected).toHaveLength(0)
    expect(mockTagService.addTag).toHaveBeenCalledWith(testTags[0])
  })

  test("既存のタグと重複する新規データが破棄される", () => {
    mockTagService.getTagsOrdered.mockReturnValue([testTags[0]])
    const result = importService.importData({
      achievements: [],
      stars: [],
      tags: [testTags[0]],
      taggings: [],
    })

    expect(result.tags.added).toHaveLength(0)
    expect(result.tags.rejected).toHaveLength(1)
  })

  test("既存のタグとタイトルが衝突する新規データが破棄される", () => {
    mockTagService.getTagsOrdered.mockReturnValue([testTags[0]])
    const result = importService.importData({
      achievements: [],
      stars: [],
      tags: [testTags[2]],
      taggings: [],
    })

    expect(result.tags.added).toHaveLength(0)
    expect(result.tags.rejected).toHaveLength(1)
  })

  test("インポートされたタグが既存のタグの後ろに order 順で追加される", () => {
    mockTagService.getTagsOrdered.mockReturnValue([testTags[3]])
    const result = importService.importData({
      achievements: [],
      stars: [],
      tags: [testTags[1], testTags[0]],
      taggings: [],
    })

    expect(result.tags.added).toHaveLength(2)
    expect(result.tags.rejected).toHaveLength(0)
    expect(mockTagService.addTag.mock.calls[0][0]).toEqual(testTags[0])
    expect(mockTagService.addTag.mock.calls[1][0]).toEqual(testTags[1])
  })

  test("新規達成事項への tagging が追加される", () => {
    const tagging = { achievementId: testAchievements[0].id, tagId: testTags[0].id }

    mockEntryService.getAchievements.mockReturnValue([])
    mockTagService.getTagsOrdered.mockReturnValue([testTags[0]])
    const result = importService.importData({
      achievements: [testAchievements[0]],
      stars: [],
      tags: [],
      taggings: [tagging],
    })

    expect(result.taggings.added).toHaveLength(1)
    expect(result.taggings.rejected).toHaveLength(0)
    expect(mockTaggingService.addTagging).toHaveBeenCalled(tagging)
  })

  test("既存の達成事項への tagging が破棄される", () => {
    const tagging = { achievementId: testAchievements[0].id, tagId: testTags[0].id }

    mockEntryService.getAchievements.mockReturnValue([testAchievements[0]])
    mockTagService.getTagsOrdered.mockReturnValue([testTags[0]])
    const result = importService.importData({
      achievements: [],
      stars: [],
      tags: [],
      taggings: [tagging],
    })

    expect(result.taggings.added).toHaveLength(0)
    expect(result.taggings.rejected).toHaveLength(1)
  })

  test("対応するタグが存在しない tagging が破棄される", () => {
    const tagging = { achievementId: testAchievements[0].id, tagId: testTags[0].id }

    mockTagService.getTagsOrdered.mockReturnValue([testAchievements[0]])
    mockTagService.getTagsOrdered.mockReturnValue([])
    const result = importService.importData({
      achievements: [],
      stars: [],
      tags: [],
      taggings: [tagging],
    })

    expect(result.taggings.added).toHaveLength(0)
    expect(result.taggings.rejected).toHaveLength(1)
  })
})
