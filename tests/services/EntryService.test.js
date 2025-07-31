const testIds = ["a3e79cc2-c06c-4034-b3b1-cbd25b327c9d"]

vi.mock("@/utils/idUtils.js", () => ({
  isValidId: vi.fn(() => true),
  generateId: vi.fn(() => testIds[0]),
}))

import { EntryService } from "@/services/EntryService.js"

describe("EntryService.js", () => {
  let entryService
  let mockEntryRepository, mockTagRepository, mockTaggingRepository

  const testAchievements = [
    {
      id: "0b3df1d5-eb66-4dd4-b9c9-08f01555bcf1",
      content: "achievement 1",
      entryType: "achievement",
      isReviewed: false,
      date: new Date("2025-04-01"),
    },
    {
      id: "5b9a5917-43a8-47a0-8f34-bc3bba96bb01",
      content: "achievement 2",
      entryType: "achievement",
      isReviewed: false,
      date: new Date("2025-04-02"),
    },
  ]
  const testStars = [
    {
      id: "e2bd92e0-5b57-4b84-9307-a49ec5518bce",
      achievementId: "0b3df1d5-eb66-4dd4-b9c9-08f01555bcf1",
      content: "star 1",
      reviewType: null,
      date: new Date("2025-04-01"),
    },
  ]
  const testTags = [
    {
      id: "6e971677-ebbe-49b1-a0a9-23d4fb962301",
      title: "tag 1",
      order: 1,
    },
    {
      id: "d7aee519-c00e-41e8-9b22-5f2ee0c00019",
      title: "tag 2",
      order: 2,
    },
  ]
  const testTaggings = [
    {
      achievementId: "0b3df1d5-eb66-4dd4-b9c9-08f01555bcf1",
      tagId: "6e971677-ebbe-49b1-a0a9-23d4fb962301",
    },
    {
      achievementId: "0b3df1d5-eb66-4dd4-b9c9-08f01555bcf1",
      tagId: "d7aee519-c00e-41e8-9b22-5f2ee0c00019",
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockEntryRepository = {
      addAchievement: vi.fn((achievement) => achievement),
      addStar: vi.fn((star) => star),
      addEntry: vi.fn((entry) => entry),
      hasAchievement: vi.fn(() => false),
      hasStar: vi.fn(() => false),
      getAll: vi.fn(() => []),
      getAchievements: vi.fn(() => []),
      getStars: vi.fn(() => []),
    }

    mockTagRepository = {
      getAll: vi.fn(() => []),
    }

    mockTaggingRepository = {
      getAll: vi.fn(() => []),
    }

    entryService = new EntryService({
      entryRepository: mockEntryRepository,
      tagRepository: mockTagRepository,
      taggingRepository: mockTaggingRepository,
    })
  })

  test("addEntry で正常なデータを保存できる", () => {
    mockEntryRepository.addAchievement.mockImplementation((achievement) => achievement)
    mockEntryRepository.addStar.mockImplementation((star) => star)

    // まず addAchievement で 1 回呼ばれ, 次に addStar で n 回呼ばれる
    mockEntryRepository.hasAchievement.mockReturnValue(true).mockReturnValueOnce(false)
    mockEntryRepository.hasStar.mockReturnValue(false)

    const testEntry = {
      ...testAchievements[0],
      stars: [testStars[0]],
    }

    const result = entryService.addEntry(testEntry)

    expect(mockEntryRepository.addAchievement).toHaveBeenCalledWith(testAchievements[0])
    expect(mockEntryRepository.addStar).toHaveBeenCalledWith(testStars[0])
    expect(result).toEqual(testEntry)
  })

  test("addEntry で id, stars を省略できる", () => {
    mockEntryRepository.addAchievement.mockImplementation(
      ({ content, entryType, isReviewed, date }) => ({
        id: testIds[0],
        content,
        entryType,
        isReviewed,
        date,
      }),
    )
    mockEntryRepository.hasAchievement.mockReturnValue(true).mockReturnValueOnce(false)

    const achievement = {
      content: testAchievements[0].content,
      entryType: testAchievements[0].entryType,
      isReviewed: testAchievements[0].isReviewed,
      date: testAchievements[0].date,
    }
    const result = entryService.addEntry(achievement)
    expect(mockEntryRepository.addAchievement).toHaveBeenCalledWith({
      id: testIds[0],
      ...achievement,
    })
    expect(result).toEqual({
      id: testIds[0],
      ...achievement,
      stars: [],
    })
  })

  test("addAchievement で正常なデータを保存できる", () => {
    const result = entryService.addAchievement(testAchievements[0])

    expect(mockEntryRepository.addAchievement).toHaveBeenCalledWith(testAchievements[0])

    expect(result).toEqual(testAchievements[0])
  })

  test("addAchievement で id を省略した際に UUID が生成される", () => {
    const result = entryService.addAchievement({
      content: testAchievements[0].content,
      entryType: testAchievements[0].entryType,
      isReviewed: testAchievements[0].isReviewed,
      date: testAchievements[0].date,
    })

    // mock した generateId から事前に用意しておいた id が渡される
    expect(result).toEqual({
      id: testIds[0],
      content: testAchievements[0].content,
      entryType: testAchievements[0].entryType,
      isReviewed: testAchievements[0].isReviewed,
      date: testAchievements[0].date,
    })

    expect(mockEntryRepository.addAchievement).toHaveBeenCalledWith({
      id: testIds[0],
      content: testAchievements[0].content,
      entryType: testAchievements[0].entryType,
      isReviewed: testAchievements[0].isReviewed,
      date: testAchievements[0].date,
    })
  })

  test("addStar で正常なデータを保存できる", () => {
    // 対応する achievements が存在するとする
    mockEntryRepository.hasAchievement.mockImplementation((id) => id === testStars[0].achievementId)

    const result = entryService.addStar(testStars[0])

    expect(mockEntryRepository.addStar).toHaveBeenCalledWith(testStars[0])
    expect(result).toEqual(testStars[0])
  })

  test("addStar で id を省略した際に UUID が生成される", () => {
    // 対応する achievements が存在するとする
    mockEntryRepository.hasAchievement.mockImplementation((id) => id === testStars[0].achievementId)

    const result = entryService.addStar({
      achievementId: testStars[0].achievementId,
      content: testStars[0].content,
      reviewType: testStars[0].reviewType,
      date: testStars[0].date,
    })

    // mock した generateId から事前に用意しておいた id が渡される
    expect(result).toEqual({
      id: testIds[0],
      achievementId: testStars[0].achievementId,
      content: testStars[0].content,
      reviewType: testStars[0].reviewType,
      date: testStars[0].date,
    })

    expect(mockEntryRepository.addStar).toHaveBeenCalledWith({
      id: testIds[0],
      achievementId: testStars[0].achievementId,
      content: testStars[0].content,
      reviewType: testStars[0].reviewType,
      date: testStars[0].date,
    })
  })

  test("getAchievements で正常にデータを取得できる", () => {
    mockEntryRepository.getAchievements.mockReturnValue([testAchievements[0]])
    const result = entryService.getAchievements()

    expect(mockEntryRepository.getAchievements).toHaveBeenCalled()
    expect(result).toEqual([testAchievements[0]])
  })

  test("getStars で正常にデータを取得できる", () => {
    mockEntryRepository.getStars.mockReturnValue([testStars[0]])
    const result = entryService.getStars()

    expect(mockEntryRepository.getStars).toHaveBeenCalled()
    expect(result).toEqual([testStars[0]])
  })

  test("getEntriesWithTags で正常にデータを取得できる", () => {
    mockEntryRepository.getAll.mockReturnValue([
      { ...testAchievements[1], stars: [] },
      { ...testAchievements[0], stars: [testStars[0]] },
    ])
    mockTagRepository.getAll.mockReturnValue([testTags[0]])
    mockTaggingRepository.getAll.mockReturnValue([testTaggings[0]])

    const result = entryService.getEntriesWithTags()
    expect(mockEntryRepository.getAll).toHaveBeenCalled()
    expect(mockTagRepository.getAll).toHaveBeenCalled()
    expect(mockTaggingRepository.getAll).toHaveBeenCalled()
    expect(result).toEqual([
      { ...testAchievements[1], stars: [], tags: [] },
      {
        ...testAchievements[0],
        stars: [testStars[0]],
        tags: [{ achievementId: testAchievements[0].id, ...testTags[0] }],
      },
    ])
  })
})
