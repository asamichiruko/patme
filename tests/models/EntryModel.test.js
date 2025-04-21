import { EntryModel } from "@/models/EntryModel.js"
import { LocalStorageAdapter } from "@/models/LocalStorageAdapter.js"

describe("EntryModel.js", () => {
  let model
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
      {
        id: "f9bc95be-8869-4682-8ee8-462f4d37aee4",
        title: "テストタグ3",
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

  beforeEach(() => {
    localStorage.clear()
    const adapter = new LocalStorageAdapter()
    model = new EntryModel(adapter)
  })

  test("必要なデータを achievement に結合した entry を取得できる", () => {
    const expectedEntries = [
      {
        achievement: {
          id: "c2e0439a-7cd0-4743-a9ef-b299699f09a6",
          content: "テスト記録1",
          date: new Date("2025-04-01 15:00:00"),
        },
        stars: [],
        tags: [],
      },
      {
        achievement: {
          id: "8adcf1ba-89d8-475f-b651-b14df49853eb",
          content: "テスト記録2",
          date: new Date("2025-04-01 16:00:00"),
        },
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
            achievementId: "8adcf1ba-89d8-475f-b651-b14df49853eb",
            title: "テストタグ1",
          },
          {
            id: "8ba3e7cf-cccd-435f-a97a-c1d60c685929",
            achievementId: "8adcf1ba-89d8-475f-b651-b14df49853eb",
            title: "テストタグ2",
          },
        ],
      },
    ]
    expectedEntries.sort((a, b) => b.achievement.date - a.achievement.date)

    model.importFromJson(validJson)
    const entries = model.getEntries()

    expect(entries).toEqual(expectedEntries)
  })

  test("achievement にタグを追加できる", () => {
    model.importFromJson(validJson)

    const achievementId = validJson.achievements[0].id
    const tagIds = [validJson.tags[2].id]
    model.setTagsForAchievement({ achievementId, tagIds })

    expect(model.getEntries()).toContainEqual({
      achievement: {
        id: "c2e0439a-7cd0-4743-a9ef-b299699f09a6",
        content: "テスト記録1",
        date: new Date("2025-04-01 15:00:00"),
      },
      stars: [],
      tags: [
        {
          achievementId: "c2e0439a-7cd0-4743-a9ef-b299699f09a6",
          id: "f9bc95be-8869-4682-8ee8-462f4d37aee4",
          title: "テストタグ3",
        },
      ],
    })
  })

  test("すでに achievement に割り当てられているタグは追加しない", () => {
    model.importFromJson(validJson)
    const beforeAdd = model.getEntries()

    const achievementId = validJson.achievements[1].id
    const tagIds = [validJson.tags[0].id, validJson.tags[1].id]
    model.setTagsForAchievement({ achievementId, tagIds })

    expect(model.getEntries()).toEqual(beforeAdd)
  })

  test("achievement に割り当てられているタグを削除できる", () => {
    model.importFromJson(validJson)

    const achievementId = validJson.achievements[1].id
    const tagIds = [validJson.tags[0].id]
    model.setTagsForAchievement({ achievementId, tagIds })

    expect(model.getEntries()).toContainEqual({
      achievement: {
        id: "8adcf1ba-89d8-475f-b651-b14df49853eb",
        content: "テスト記録2",
        date: new Date("2025-04-01 16:00:00"),
      },
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
          achievementId: "8adcf1ba-89d8-475f-b651-b14df49853eb",
          title: "テストタグ1",
        },
      ],
    })
  })

  test("正常なデータをインポートできる", () => {
    model.importFromJson(validJson)

    const achievements = model.storage.getAchievements()
    const stars = model.storage.getStars()
    const tags = model.storage.getTags()
    const taggings = model.storage.getTaggings()
    expect(achievements).toEqual(validJson.achievements)
    expect(stars).toEqual(validJson.stars)
    expect(tags).toEqual(validJson.tags)
    expect(taggings).toEqual(validJson.taggings)
  })

  test("必要なキーを持たない json をインポートするとエラーを送出する", () => {
    const invalidJson = { wrongKey: [] }
    expect(() => model.importFromJson(invalidJson)).toThrow(SyntaxError)
  })

  test("不正な形式のデータはインポートしない", () => {
    const invalidJson = {
      achievements: [
        {
          id: "invalid-id",
          content: "不正な記録 (invalid id)",
          date: new Date("2025-04-02-15:00:00"),
        },
        {
          id: "f0722975-654c-4482-abcd-418f9a934d2d",
          content: "",
          date: new Date("2025-04-02-16:00:00"),
        },
        {
          id: "dcdaf1c8-fb8a-4b23-aeda-2a51bd2a4a1a",
          content: "不正な記録 (invalid date)",
          date: "Invalid Date",
        },
      ],
      stars: [
        {
          id: "invalid-id",
          achievementId: "c2e0439a-7cd0-4743-a9ef-b299699f09a6",
          content: "不正なスター (invalid id)",
          date: new Date("2025-04-02-15:30"),
        },
        {
          id: "d0659f4d-4d7b-4328-ad5e-ec6057009bf1",
          achievementId: "invalid-id",
          content: "不正なスター (invalid achievementId)",
          date: new Date("2025-04-02-16:30"),
        },
        {
          id: "02d6e790-b78f-4831-a2f4-9ea2bc442336",
          achievementId: "invalid-id",
          content: "不正なスター (invalid-date)",
          date: "invalid date",
        },
      ],
      tags: [],
      taggings: [],
    }
    model.importFromJson(validJson)
    model.importFromJson(invalidJson)

    const achievements = model.storage.getAchievements()
    const stars = model.storage.getStars()
    expect(achievements).toEqual(validJson.achievements)
    expect(stars).toEqual(validJson.stars)
  })

  test("id が重複するデータはインポートしない", () => {
    model.importFromJson(validJson)
    model.importFromJson(validJson) // import twice

    const achievements = model.storage.getAchievements()
    const stars = model.storage.getStars()
    expect(achievements.length).toBe(validJson.achievements.length)
    expect(stars.length).toBe(validJson.stars.length)
  })

  test("インポートしたデータを正常にエクスポートできる", () => {
    model.importFromJson(validJson)

    const exportData = model.exportAsJson()
    expect(exportData).toEqual(validJson)
  })

  test("空のストレージから正常にエクスポートできる", () => {
    const exportData = model.exportAsJson()
    expect(exportData).toEqual({ achievements: [], stars: [], tags: [], taggings: [] })
  })
})
