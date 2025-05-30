import { setActivePinia, createPinia } from "pinia"
import { useTaggingStore } from "@/stores/useTaggingStore.js"
import * as storageNotifier from "@/utils/storageNotifier.js"

describe("useTaggingStore.js", () => {
  let mockTaggingService
  let taggingStore
  let notifySpy

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    mockTaggingService = {
      updateTaggings: vi.fn(),
    }
    taggingStore = useTaggingStore()
    taggingStore.setService({
      taggingService: mockTaggingService,
    })

    notifySpy = vi.spyOn(storageNotifier, "notify")
  })

  test("setService が正しく呼び出されていない場合に例外が送られる", () => {
    taggingStore.setService({ taggingService: null })

    const testTaggings = { achievementId: "achievement1", tagIds: ["tag1", "tag2"] }

    expect(() => taggingStore.updateTaggings(testTaggings)).toThrow(/TaggingService/i)
  })

  test("updateTaggings が正常に移譲されて notify が呼ばれる", () => {
    const testTaggings = { achievementId: "achievement1", tagIds: ["tag1", "tag2"] }

    taggingStore.updateTaggings(testTaggings)

    expect(mockTaggingService.updateTaggings).toHaveBeenCalledWith(testTaggings)
    expect(notifySpy).toHaveBeenCalled()
  })
})
