vi.mock("@/utils/storageNotifier.js", () => ({ notify: vi.fn() }))

import { notify } from "@/utils/storageNotifier.js"
import { TaggingModel } from "@/models/TaggingModel.js"

describe("TaggingModel.js", () => {
  let taggingModel
  let taggingService, tagService

  beforeEach(() => {
    vi.clearAllMocks()

    taggingService = {
      updateTaggings: vi.fn(),
    }
    tagService = {}

    taggingModel = new TaggingModel({ taggingService, tagService })
  })

  test("updateTaggings が taggingModel.updateTaggings に移譲される", () => {
    const data = { achievementId: "achievement1", tagIds: ["tag1", "tag2"] }
    taggingModel.updateTaggings(data)

    expect(taggingService.updateTaggings).toHaveBeenCalledWith(data.achievementId, data.tagIds)
    expect(notify).toHaveBeenCalled()
  })
})
