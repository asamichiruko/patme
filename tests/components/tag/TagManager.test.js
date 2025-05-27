import { render, screen, cleanup, fireEvent } from "@testing-library/vue"
import TagManager from "@/components/tag/TagManager.vue"
import * as tagStore from "@/stores/useTagStore.js"
import * as notificationBar from "@/composables/useNotificationBar.js"
import { createTestingPinia } from "@pinia/testing"
import { defineComponent, h } from "vue"

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
    const resetOrderMock = vi.fn()

    const TagOrderListStub = defineComponent({
      name: "TagOrderList",
      setup(_, { expose }) {
        expose({ resetOrder: resetOrderMock })
        return () => h("div", "stub")
      },
    })

    render(TagManager, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
        stubs: {
          TagOrderList: TagOrderListStub,
        },
      },
    })

    const cancelButton = screen.getByRole("button", { name: /キャンセル/i })
    await fireEvent.click(cancelButton)

    expect(resetOrderMock).toHaveBeenCalled()
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "info")
  })

  test("update イベントを受け取ると保存すべきリストの順序が更新される", async () => {
    const updatedTags = [
      { id: "id2", title: "tag2", order: 1 },
      { id: "id1", title: "tag1", order: 2 },
    ]

    const TagOrderListStub = defineComponent({
      name: "TagOrderList",
      emits: ["update"],
      setup(_, { emit }) {
        return () =>
          h(
            "button",
            {
              onClick: () => emit("update", updatedTags),
            },
            "Update",
          )
      },
    })

    render(TagManager, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
        stubs: {
          TagOrderList: TagOrderListStub,
        },
      },
    })

    const stub = screen.getByRole("button", { name: "Update" })
    await fireEvent.click(stub)

    // 保存ボタンの副作用でリスト順が更新されていることを確認する
    const saveButton = screen.getByRole("button", { name: /保存/i })
    await fireEvent.click(saveButton)

    expect(reorderTagByIdsMock).toHaveBeenCalledWith(["id2", "id1"])
  })
})
