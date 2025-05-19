vi.mock("@/utils/storageNotifier.js", () => ({ notify: vi.fn() }))

import { notify } from "@/utils/storageNotifier.js"
import { TagModel } from "@/models/TagModel.js"

describe("TagModel.js", () => {
  let tagModel
  let tagService

  beforeEach(() => {
    vi.clearAllMocks()

    tagService = {
      addTag: vi.fn(),
      getTagsOrdered: vi.fn(() => []),
      reorderTagByIds: vi.fn(),
    }
    tagModel = new TagModel(tagService)
  })

  test("addTag が tagService.addTag に移譲される", () => {
    tagService.addTag.mockReturnValue({ id: "tag1", title: "tag 1" })
    tagModel.addTag({ title: "tag 1" })

    expect(tagService.addTag).toHaveBeenCalledWith({ title: "tag 1" })
    expect(notify).toHaveBeenCalled()
  })

  test("getTagsOrdered が tagService.getTagsOrdered に移譲される", () => {
    tagModel.getTagsOrdered()

    expect(tagService.getTagsOrdered).toHaveBeenCalled()
  })

  test("reorderTagByIds が tagService.reorderTagByIds に移譲される", () => {
    tagModel.reorderTagByIds([])

    expect(tagService.reorderTagByIds).toHaveBeenCalledWith([])
    expect(notify).toHaveBeenCalled()
  })
})
