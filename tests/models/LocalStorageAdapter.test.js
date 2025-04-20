import { LocalStorageAdapter } from "@/models/LocalStorageAdapter.js"

describe("LocalStorageAdapter.js", () => {
  const validJson = {
    achievements: [
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
    ],
    stars: [
      {
        id: "13ac6ed5-e94e-4a56-8967-cc53d9c26eea",
        achievementId: "8adcf1ba-89d8-475f-b651-b14df49853eb",
        content: "スター1 (テスト記録2)",
        date: new Date("2025-04-01 16:30"),
      },
    ],
    tags: [
      {
        id: "5ade7aff-2c3e-48ca-8ad2-5cd8fdae3e0c",
        title: "テストタグ1",
      },
      {
        id: "8ba3e7cf-cccd-435f-a97a-c1d60c685929",
        title: "テストタグ2",
      },
    ],
    taggings: [
      {
        achievementId: "8adcf1ba-89d8-475f-b651-b14df49853eb",
        tagId: "5ade7aff-2c3e-48ca-8ad2-5cd8fdae3e0c",
      },
      {
        achievementId: "8adcf1ba-89d8-475f-b651-b14df49853eb",
        tagId: "8ba3e7cf-cccd-435f-a97a-c1d60c685929",
      },
    ],
  }

  let adapter

  beforeEach(() => {
    localStorage.clear()
    adapter = new LocalStorageAdapter()
  })

  test("achievement を保存できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.addAchievement(validJson.achievements[0])

    const localStorageData = JSON.parse(localStorage.getItem("achievements")).map((a) => {
      return { id: a.id, content: a.content, date: new Date(a.date) }
    })
    expect(localStorageData).toEqual([validJson.achievements[0]])
  })

  test("star を保存できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.addAchievement(validJson.achievements[1])
    adapter.addStar(validJson.stars[0])

    const localStorageData = JSON.parse(localStorage.getItem("stars")).map((a) => {
      return {
        id: a.id,
        achievementId: a.achievementId,
        content: a.content,
        date: new Date(a.date),
      }
    })
    expect(localStorageData).toEqual([validJson.stars[0]])
  })

  test("複数の achievement を保存できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.importAchievements(validJson.achievements)

    const localStorageData = JSON.parse(localStorage.getItem("achievements")).map((a) => {
      return { id: a.id, content: a.content, date: new Date(a.date) }
    })
    expect(localStorageData).toEqual(validJson.achievements)
  })

  test("空の achievements 配列を保存できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.importAchievements([])

    const localStorageData = JSON.parse(localStorage.getItem("achievements"))
    expect(localStorageData).toEqual([])
  })

  test("保存した複数の achievements を取得できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.importAchievements(validJson.achievements)

    expect(adapter.getAchievements()).toEqual(validJson.achievements)
  })

  test("空のストレージから空の achivements 配列を取得できる", () => {
    adapter = new LocalStorageAdapter()
    expect(adapter.getAchievements()).toEqual([])
  })

  test("複数の star を保存できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.importAchievements(validJson.achievements)
    adapter.importStars(validJson.stars)

    const localStorageData = JSON.parse(localStorage.getItem("stars")).map((a) => {
      return {
        id: a.id,
        achievementId: a.achievementId,
        content: a.content,
        date: new Date(a.date),
      }
    })
    expect(localStorageData).toEqual(validJson.stars)
  })

  test("空の stars 配列を保存できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.importAchievements([])
    adapter.importStars([])

    const localStorageData = JSON.parse(localStorage.getItem("stars"))
    expect(localStorageData).toEqual([])
  })

  test("保存した stars 配列を取得できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.importAchievements(validJson.achievements)
    adapter.importStars(validJson.stars)

    expect(adapter.getStars()).toEqual(validJson.stars)
  })

  test("空のストレージから空の stars 配列を取得できる", () => {
    adapter = new LocalStorageAdapter()

    expect(adapter.getStars()).toEqual([])
  })

  test("tag を保存できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.addTag(validJson.tags[0])

    const localStorageData = JSON.parse(localStorage.getItem("tags"))
    expect(localStorageData).toEqual([validJson.tags[0]])
  })

  test("複数の tag を保存できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.importTags(validJson.tags)

    const localStorageData = JSON.parse(localStorage.getItem("tags"))
    expect(localStorageData).toEqual(validJson.tags)
  })

  test("空のストレージから空の tags 配列を取得できる", () => {
    adapter = new LocalStorageAdapter()
    expect(adapter.getTags()).toEqual([])
  })

  test("保存した tags 配列を取得できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.importTags(validJson.tags)

    expect(adapter.getTags()).toEqual(validJson.tags)
  })

  test("複数の tagging を保存できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.addTaggings(validJson.taggings)

    const localStorageData = JSON.parse(localStorage.getItem("taggings"))
    expect(localStorageData).toEqual(validJson.taggings)
  })

  test("保存した taggings 配列を取得できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.importTaggings(validJson.taggings)

    expect(adapter.getTaggings()).toEqual(validJson.taggings)
  })

  test("空のストレージから空の taggings 配列を取得できる", () => {
    adapter = new LocalStorageAdapter()
    expect(adapter.getTaggings()).toEqual([])
  })

  test("taggings を削除できる", () => {
    adapter = new LocalStorageAdapter()
    adapter.addTaggings(validJson.taggings)
    adapter.removeTaggings([validJson.taggings[0]])
    expect(adapter.getTaggings()).toEqual([validJson.taggings[1]])
  })
})
