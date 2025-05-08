import { EntryRepository } from "@/repositories/EntryRepository.js"

describe("EntryRepository.js", () => {
  let mockStorage
  let entryRepos

  const testAchievements = [
    {
      id: "achievement1",
      content: "achievement 1",
      date: new Date("2025-04-01"),
    },
  ]

  const testStars = [
    {
      id: "star1",
      achievementId: "achievement1",
      content: "star 1",
      date: new Date("2025-04-01"),
    },
    {
      id: "star2",
      achievementId: "achievement1",
      content: "star 2",
      date: new Date("2025-04-01"),
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockStorage = {
      load: vi.fn(() => []),
      has: vi.fn(() => true),
      save: vi.fn(),
    }
    entryRepos = new EntryRepository(mockStorage)
  })

  test("entry を追加できる", () => {
    const entry = {
      ...testAchievements[0],
      stars: testStars,
    }
    entryRepos.add(entry)

    expect(mockStorage.save).toHaveBeenCalledWith(entryRepos.achievementKey, [testAchievements[0]])
    expect(mockStorage.save).toHaveBeenCalledWith(entryRepos.starKey, [testStars[0], testStars[1]])
  })

  test("achievement を追加できる", () => {
    entryRepos.addAchievement(testAchievements[0])

    expect(mockStorage.save).toHaveBeenCalledWith(entryRepos.achievementKey, [testAchievements[0]])
  })

  test("star を追加できる", () => {
    entryRepos.addStar(testStars[0])

    expect(mockStorage.save).toHaveBeenCalledWith(entryRepos.starKey, [testStars[0]])
  })

  test("storage に achievement が存在するとき hasAchievement が true を返す", () => {
    mockStorage.load.mockReturnValue(testAchievements)

    expect(entryRepos.hasAchievement(testAchievements[0].id)).toBe(true)
  })

  test("storage に achievement が存在しないとき hasAchievement が false を返す", () => {
    mockStorage.load.mockReturnValue([])

    expect(entryRepos.hasAchievement(testAchievements[0].id)).toBe(false)
  })

  test("storage に star が存在するとき hasStar が true を返す", () => {
    mockStorage.load.mockReturnValue(testStars)

    expect(entryRepos.hasAchievement(testStars[0].id)).toBe(true)
  })

  test("storage に star が存在しないとき hasStar が false を返す", () => {
    expect(entryRepos.hasAchievement(testStars[0].id)).toBe(false)
  })

  test("getAll ですべての entries を取得できる", () => {
    mockStorage.load.mockImplementation((key) => {
      if (key === entryRepos.achievementKey) {
        return testAchievements
      } else if (key === entryRepos.starKey) {
        return testStars
      } else {
        return []
      }
    })

    const entries = entryRepos.getAll()

    expect(entries).toEqual([
      {
        ...testAchievements[0],
        stars: testStars,
      },
    ])
  })

  test("storage が空のとき getAll で空の配列を取得する", () => {
    expect(entryRepos.getAll()).toEqual([])
  })
})
