import { setActivePinia, createPinia } from "pinia"
import { useEntryStore } from "@/stores/useEntryStore.js"
import * as storageNotifier from "@/utils/storageNotifier.js"

describe("useDataTransferStore.js", () => {
  let mockEntryService
  let entryStore
  let notifySpy

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    mockEntryService = {
      getEntriesWithTags: vi.fn(),
      addAchievement: vi.fn(),
      addStar: vi.fn(),
    }
    entryStore = useEntryStore()
    entryStore.setService({
      entryService: mockEntryService,
    })

    notifySpy = vi.spyOn(storageNotifier, "notify")
  })

  test("setService が正しく呼び出されていない場合に例外が送られる", () => {
    entryStore.setService({ entryService: null })

    const testAchievement = {
      content: "achievement1",
      date: new Date("2025-04-01").toISOString(),
    }
    mockEntryService.addAchievement.mockReturnValue({ ...testAchievement, id: "id1" })

    const testStar = {
      achievementId: "achievement1",
      content: "star1",
      date: new Date("2025-04-01").toISOString(),
    }
    mockEntryService.addStar.mockReturnValue({ ...testStar, id: "id1" })

    expect(() => entryStore.getEntriesWithTags()).toThrow(/EntryService/i)
    expect(() => entryStore.addAchievement(testAchievement)).toThrow(/EntryService/i)
    expect(() => entryStore.addStar(testStar)).toThrow(/EntryService/i)
  })

  test("getEntryWithTags で entry のリストが取得される", () => {
    mockEntryService.getEntriesWithTags.mockReturnValue([])
    const sortFn = vi.fn()
    const result = entryStore.getEntriesWithTags({ sortFn })

    expect(mockEntryService.getEntriesWithTags).toHaveBeenCalledWith({ sortFn })
    expect(result).toEqual([])
  })

  test("getEntryWithTags の引数を省略できる", () => {
    mockEntryService.getEntriesWithTags.mockReturnValue([])
    const result = entryStore.getEntriesWithTags()

    expect(mockEntryService.getEntriesWithTags).toHaveBeenCalled()
    expect(result).toEqual([])
  })

  test("addAchievement で achievement が追加される", () => {
    const testAchievement = {
      content: "achievement1",
      date: new Date("2025-04-01").toISOString(),
    }
    const addedAchievement = { ...testAchievement, id: "id1" }
    mockEntryService.addAchievement.mockReturnValue(addedAchievement)
    const result = entryStore.addAchievement(testAchievement)

    expect(mockEntryService.addAchievement).toHaveBeenCalledWith(testAchievement)
    expect(result).toEqual(addedAchievement)
    expect(notifySpy).toHaveBeenCalled()
  })

  test("achievement が追加されなかった場合は notify が呼び出されない", () => {
    mockEntryService.addAchievement.mockReturnValue(null)
    const result = entryStore.addAchievement({ content: "", date: null })

    expect(mockEntryService.addAchievement).toHaveBeenCalledWith({ content: "", date: null })
    expect(result).toBeNull()
    expect(notifySpy).not.toHaveBeenCalled()
  })

  test("addStar で star が追加される", () => {
    const testStar = {
      achievementId: "achievement1",
      content: "star1",
      date: new Date("2025-04-01").toISOString(),
    }
    const addedStar = { ...testStar, id: "id1" }
    mockEntryService.addStar.mockReturnValue(addedStar)
    const result = entryStore.addStar(testStar)

    expect(mockEntryService.addStar).toHaveBeenCalledWith(testStar)
    expect(result).toEqual(addedStar)
    expect(notifySpy).toHaveBeenCalled()
  })

  test("star が追加されなかった場合は notify が呼び出されない", () => {
    mockEntryService.addStar.mockReturnValue(null)
    const result = entryStore.addStar({ achievementId: "", content: "", date: null })

    expect(mockEntryService.addStar).toHaveBeenCalledWith({
      achievementId: "",
      content: "",
      date: null,
    })
    expect(result).toBeNull()
    expect(notifySpy).not.toHaveBeenCalled()
  })
})
