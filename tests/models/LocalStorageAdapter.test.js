import { LocalStorageAdapter } from "@/models/LocalStorageAdapter.js"

describe("LocalStorageAdapter.js", () => {
  const testAchievements = [
    {
      id: "c2e0439a-7cd0-4743-a9ef-b299699f09a6",
      content: "テスト記録1",
      date: new Date("2025-04-01 15:00:00"),
    },
    {
      id: "8adcf1ba-89d8-475f-b651-b14df49853eb",
      content: "テスト記録2",
      date: new Date("2025-04-01 16:00:00"),
    },
  ]

  beforeEach(() => {
    localStorage.clear()
  })

  test("複数の achievement を保存できる", () => {
    const adapter = new LocalStorageAdapter()
    adapter.importAchievements(testAchievements)

    const localStorageData = JSON.parse(localStorage.getItem("achievements")).map((a) => {
      return { id: a.id, content: a.content, date: new Date(a.date) }
    })
    expect(localStorageData).toEqual(testAchievements)
  })

  test("空の配列を保存できる", () => {
    const adapter = new LocalStorageAdapter()
    adapter.importAchievements([])

    const localStorageData = JSON.parse(localStorage.getItem("achievements"))
    expect(localStorageData).toEqual([])
  })

  test("保存した achievements を取得できる", () => {
    const adapter = new LocalStorageAdapter()
    adapter.importAchievements(testAchievements)

    expect(adapter.getAchievements()).toEqual(testAchievements)
  })

  test("空のストレージから空の配列を取得できる", () => {
    const adapter = new LocalStorageAdapter()
    expect(adapter.getAchievements()).toEqual([])
  })
})
