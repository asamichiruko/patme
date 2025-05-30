import { setActivePinia, createPinia } from "pinia"
import { useTagStore } from "@/stores/useTagStore.js"
import * as storageNotifier from "@/utils/storageNotifier.js"

describe("useTagStore.js", () => {
  let mockTagService
  let tagStore
  let notifySpy

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    mockTagService = {
      findByTitle: vi.fn(),
      addTag: vi.fn(),
      getTagsOrdered: vi.fn(),
      reorderTagByIds: vi.fn(),
    }
    tagStore = useTagStore()
    tagStore.setService({
      tagService: mockTagService,
    })

    notifySpy = vi.spyOn(storageNotifier, "notify")
  })

  test("setService が正しく呼び出されていない場合に例外が送られる", () => {
    tagStore.setService({ tagService: null })

    const testTag = { title: "tag1" }
    const testTagWithId = { title: "tag1", id: "id1", order: 1 }
    mockTagService.findByTitle.mockReturnValue(testTagWithId)
    mockTagService.addTag.mockReturnValue(testTagWithId)
    mockTagService.getTagsOrdered.mockReturnValue([testTagWithId])

    expect(() => tagStore.findByTitle(testTag.title)).toThrow(/TagService/i)
    expect(() => tagStore.addTag(testTag.title)).toThrow(/TagService/i)
    expect(() => tagStore.getTagsOrdered()).toThrow(/TagService/i)
    expect(() => tagStore.reorderTagByIds([testTagWithId])).toThrow(/TagService/i)
  })

  test("getTagsOrdered が正常に移譲される", () => {
    mockTagService.getTagsOrdered.mockReturnValue([{ id: "id1", title: "tag1", order: 1 }])
    const result = tagStore.getTagsOrdered()

    expect(mockTagService.getTagsOrdered).toHaveBeenCalledWith()
    expect(result).toEqual([{ id: "id1", title: "tag1", order: 1 }])
  })

  test("addTag が正常に移譲される", () => {
    mockTagService.addTag.mockReturnValue({ id: "id1", title: "tag1", order: 1 })
    const result = tagStore.addTag("tag1")

    expect(mockTagService.addTag).toHaveBeenCalledWith({ title: "tag1" })
    expect(result).toEqual({ id: "id1", title: "tag1", order: 1 })
    expect(notifySpy).toHaveBeenCalled()
  })

  test("addTag で tag が追加されなかった場合は notify が呼び出されない", () => {
    mockTagService.addTag.mockReturnValue(null)
    const result = tagStore.addTag("")

    expect(mockTagService.addTag).toHaveBeenCalledWith({ title: "" })
    expect(result).toBeNull()
    expect(notifySpy).not.toHaveBeenCalled()
  })

  test("findByTitle が正常に移譲される", () => {
    mockTagService.findByTitle.mockReturnValue({ id: "id1", title: "tag1", order: 1 })
    const result = tagStore.findByTitle("tag1")

    expect(mockTagService.findByTitle).toHaveBeenCalledWith({ title: "tag1" })
    expect(result).toEqual({ id: "id1", title: "tag1", order: 1 })
  })

  test("reorderTagByIds が正常に移譲される", () => {
    tagStore.reorderTagByIds(["id1", "id2"])

    expect(mockTagService.reorderTagByIds).toHaveBeenCalledWith(["id1", "id2"])
  })
})
