import { render, screen, cleanup, fireEvent } from "@testing-library/vue"
import { mount } from "@vue/test-utils"
import TagManager from "@/components/tag/TagManager.vue"
import * as tagStore from "@/stores/useTagStore.js"
import * as notificationBar from "@/composables/useNotificationBar.js"
import { createTestingPinia } from "@pinia/testing"

describe("TagManager.vue", () => {
  let getTagsOrderedMock = vi.fn()
  let reorderTagByIdsMock = vi.fn()
  let triggerMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(tagStore, "useTagStore").mockReturnValue({
      getTagsOrdered: getTagsOrderedMock,
      reorderTagByIds: reorderTagByIdsMock,
    })

    vi.spyOn(notificationBar, "useNotificationBar").mockReturnValue({
      trigger: triggerMock,
    })
  })

  afterEach(() => {
    cleanup()
  })

  test("保存ボタンを押すとタグ順序が保存される", async () => {
    const tags = [
      { id: "id1", title: "tag1", order: 1 },
      { id: "id2", title: "tag2", order: 2 },
    ]
    getTagsOrderedMock.mockReturnValue(tags)

    render(TagManager, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const saveButton = screen.getByRole("button", { name: /保存/i })
    await fireEvent.click(saveButton)

    expect(reorderTagByIdsMock).toHaveBeenCalledWith(["id1", "id2"])
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "success")
  })

  test("キャンセルボタンを押すとタグ順序がリセットされる", async () => {
    const tags = [
      { id: "id1", title: "tag1", order: 1 },
      { id: "id2", title: "tag2", order: 2 },
    ]
    getTagsOrderedMock.mockReturnValue(tags)

    const wrapper = mount(TagManager, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const updatedTags = [
      { id: "id2", title: "tag2", order: 2 },
      { id: "id1", title: "tag1", order: 1 },
    ]

    wrapper.vm.latestTags = updatedTags

    expect(wrapper.vm.latestTags).toEqual(updatedTags)

    const cancelButton = wrapper.get("button.cancel-button")
    await cancelButton.trigger("click")

    expect(wrapper.vm.latestTags).toEqual(tags)
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "info")
  })
})
