import { EntryModel } from "@/models/EntryModel.js"
import { TagModel } from "@/models/TagModel.js"
import { TaggingModel } from "@/models/TaggingModel.js"
import { LocalStorageAdapter } from "@/models/LocalStorageAdapter.js"

describe("EntryModel.js", () => {
  let model
  let tagModel
  let taggingModel

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
        order: 1,
      },
      {
        id: "8ba3e7cf-cccd-435f-a97a-c1d60c685929",
        title: "テストタグ2",
        order: 2,
      },
      {
        id: "f9bc95be-8869-4682-8ee8-462f4d37aee4",
        title: "テストタグ3",
        order: 3,
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
  const expectedEntryList = [
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
          order: 1,
        },
        {
          id: "8ba3e7cf-cccd-435f-a97a-c1d60c685929",
          achievementId: "8adcf1ba-89d8-475f-b651-b14df49853eb",
          title: "テストタグ2",
          order: 2,
        },
      ],
    },
    {
      achievement: {
        id: "c2e0439a-7cd0-4743-a9ef-b299699f09a6",
        content: "テスト記録1",
        date: new Date("2025-04-01 15:00:00"),
      },
      stars: [],
      tags: [],
    },
  ]

  beforeEach(() => {
    localStorage.clear()
    const adapter = new LocalStorageAdapter()
    model = new EntryModel(adapter)
    tagModel = new TagModel(adapter)
    taggingModel = new TaggingModel(adapter)
  })

  test("必要なデータを achievement に結合した entry を取得できる", () => {
    model.importFromJson(validJson)
    const entries = model.getEntries()

    expect(entries).toHaveLength(expectedEntryList.length)
    expect(entries).toEqual(expectedEntryList)
  })

  test("achievement にタグを追加できる", () => {
    model.importFromJson(validJson)

    const achievementId = validJson.achievements[0].id
    const tagIds = [validJson.tags[2].id]
    taggingModel.setTagsForAchievement({ achievementId, tagIds })

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
          order: 3,
        },
      ],
    })
  })

  test("すでに achievement に割り当てられているタグは追加しない", () => {
    model.importFromJson(validJson)
    const beforeAdd = model.getEntries()

    const achievementId = validJson.achievements[1].id
    const tagIds = [validJson.tags[0].id, validJson.tags[1].id]
    taggingModel.setTagsForAchievement({ achievementId, tagIds })

    expect(model.getEntries()).toEqual(beforeAdd)
  })

  test("achievement に割り当てられているタグを削除できる", () => {
    model.importFromJson(validJson)

    const achievementId = validJson.achievements[1].id
    const tagIds = [validJson.tags[0].id]
    taggingModel.setTagsForAchievement({ achievementId, tagIds })

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
          order: 1,
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
    expect(tags.length).toBe(validJson.tags.length)
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
    expect(exportData.achievements.length).toBe(validJson.achievements.length)
    expect(exportData.stars.length).toBe(validJson.stars.length)
    expect(exportData.tags.length).toBe(validJson.tags.length)
    expect(exportData.taggings.length).toBe(validJson.taggings.length)
  })

  test("空のストレージから正常にエクスポートできる", () => {
    const exportData = model.exportAsJson()
    expect(exportData).toEqual({ achievements: [], stars: [], tags: [], taggings: [] })
  })

  test("order が補完されるとき、既存の order と重複しない", () => {
    model.importFromJson(validJson)
    const orders = tagModel
      .getAllTags()
      .map((tag) => tag.order)
      .filter((order) => order != null)
    const uniqueOrders = new Set(orders)

    expect(orders.length).toBe(uniqueOrders.size)
  })

  test("order がない既存のタグに番号が振られる", () => {
    const existing = [
      { id: "53b256d2-d56e-4455-b033-c299ce02a2c6", title: "tag1", order: 1 },
      { id: "7c4adfab-777a-4a68-b355-450e6f6c670c", title: "tag2" },
    ]
    const newer = []

    const { merged } = model.mergeTags(existing, newer)
    const orders = merged.map((tag) => tag.order)
    const uniqueOrders = new Set(orders)

    expect(orders.length).toBe(2)
    expect(uniqueOrders.size).toBe(2)
  })

  test("order がない新規のタグに番号が振られる", () => {
    const existing = []
    const newer = [
      { id: "8a33edf2-4fc9-4dd7-9d00-e0bccba7c783", title: "tag2" },
      { id: "ecd892c5-a9c4-4bbc-aee2-0b086b0a71d2", title: "tag3" },
    ]

    const { merged } = model.mergeTags(existing, newer)
    const orders = merged.map((tag) => tag.order)
    const uniqueOrders = new Set(orders)

    expect(orders.length).toBe(2)
    expect(uniqueOrders.size).toBe(2)
  })

  test("新旧のタグが混在しても正しく番号が振られる", () => {
    const existing = [
      { id: "53b256d2-d56e-4455-b033-c299ce02a2c6", title: "tag1", order: 1 },
      { id: "7c4adfab-777a-4a68-b355-450e6f6c670c", title: "tag2" },
    ]
    const newer = [
      { id: "8a33edf2-4fc9-4dd7-9d00-e0bccba7c783", title: "tag3", order: 2 },
      { id: "ecd892c5-a9c4-4bbc-aee2-0b086b0a71d2", title: "tag4" },
    ]

    const { merged } = model.mergeTags(existing, newer)
    const orders = merged.map((tag) => tag.order)
    const uniqueOrders = new Set(orders)

    expect(orders.length).toBe(4)
    expect(uniqueOrders.size).toBe(4)
  })

  test("重複する id を持つタグが reject される", () => {
    const existing = [
      { id: "53b256d2-d56e-4455-b033-c299ce02a2c6", title: "tag1", order: 1 },
      { id: "7c4adfab-777a-4a68-b355-450e6f6c670c", title: "tag2", order: 2 },
    ]
    const newer = [{ id: "7c4adfab-777a-4a68-b355-450e6f6c670c", title: "tag3" }]

    const { rejected } = model.mergeTags(existing, newer)
    expect(rejected).toHaveLength(1)
  })

  test("重複する title を持つタグが reject される", () => {
    const existing = [
      { id: "53b256d2-d56e-4455-b033-c299ce02a2c6", title: "tag1", order: 1 },
      { id: "7c4adfab-777a-4a68-b355-450e6f6c670c", title: "tag2", order: 2 },
    ]
    const newer = [{ id: "8a33edf2-4fc9-4dd7-9d00-e0bccba7c783", title: "tag2" }]

    const { rejected } = model.mergeTags(existing, newer)
    expect(rejected).toHaveLength(1)
  })
})
