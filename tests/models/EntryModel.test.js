vi.mock("@/utils/storageNotifier.js", () => ({ notify: vi.fn() }))

import { notify } from "@/utils/storageNotifier.js"
import { EntryModel } from "@/models/EntryModel.js"

describe("EntryModel.js", () => {
  let entryModel
  let entryService

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
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    entryService = {
      addAchievement: vi.fn((achievement) => achievement),
      addStar: vi.fn((star) => star),
      getEntriesWithTags: vi.fn(),
    }
    entryModel = new EntryModel(entryService)
  })

  test("addAchievement が entryService.addAchievement に移譲される", () => {
    const data = {
      content: testAchievements[0].content,
      date: testAchievements[0].date,
    }
    const result = entryModel.addAchievement(data)

    expect(entryService.addAchievement).toHaveBeenCalledWith(data)
    expect(notify).toHaveBeenCalled()
    expect(result).toBeTruthy()
  })

  test("addStar が entryService.addStar に移譲される", () => {
    const data = {
      achievementId: testStars[0].achievementId,
      content: testStars[0].content,
      date: testStars[0].date,
    }
    const result = entryModel.addStar(data)

    expect(entryService.addStar).toHaveBeenCalledWith(data)
    expect(notify).toHaveBeenCalled()
    expect(result).toBeTruthy()
  })

  test("getEntriesWithTags が entryService.getEntriesWithTags に移譲される", () => {
    const sortFn = vi.fn()
    entryModel.getEntriesWithTags({ sortFn })

    expect(entryService.getEntriesWithTags).toHaveBeenCalledWith({ sortFn })
  })
})
