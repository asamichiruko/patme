import { useTagOrderList } from "@/composables/useTagOrderList.js"
import { ref } from "vue"

describe("useTagOrderList.js", () => {
  let tags
  let getHandleElementById
  let handleElementMock

  beforeEach(() => {
    vi.clearAllMocks()

    tags = ref([
      { id: "id1", title: "tag1", order: 1 },
      { id: "id2", title: "tag2", order: 2 },
      { id: "id3", title: "tag3", order: 3 },
    ])
    handleElementMock = {
      focus: vi.fn(),
      scrollIntoView: vi.fn(),
    }
    getHandleElementById = vi.fn().mockReturnValue(handleElementMock)
  })

  test("正常に activate/deactivate される", () => {
    const { activeTagId, isActive, handleKeydown } = useTagOrderList(tags, getHandleElementById)

    expect(activeTagId.value).toBeNull()
    handleKeydown({ key: "Enter", preventDefault: vi.fn() }, "id1")
    expect(activeTagId.value).toBe("id1")
    expect(isActive("id1")).toBe(true)
    expect(isActive("id2")).toBe(false)
    expect(isActive("id3")).toBe(false)

    handleKeydown({ key: "Escape", preventDefault: vi.fn() }, "id1")
    expect(activeTagId.value).toBeNull()
  })

  test("activate されていない tag について, 上下キーでフォーカスが移動される", () => {
    const { handleKeydown } = useTagOrderList(tags, getHandleElementById)
    handleKeydown({ key: "ArrowDown", preventDefault: vi.fn() }, "id1")

    expect(getHandleElementById).toHaveBeenCalledWith("id2")
    expect(handleElementMock.focus).toHaveBeenCalled()
    expect(handleElementMock.scrollIntoView).toHaveBeenCalled()
  })

  test("activate されている tag について, 上下キーで tag が移動される", () => {
    const { handleKeydown } = useTagOrderList(tags, getHandleElementById)
    handleKeydown({ key: "Enter", preventDefault: vi.fn() }, "id1")
    handleKeydown({ key: "ArrowDown", preventDefault: vi.fn() }, "id1")

    expect(tags.value).toEqual([
      { id: "id2", title: "tag2", order: 2 },
      { id: "id1", title: "tag1", order: 1 },
      { id: "id3", title: "tag3", order: 3 },
    ])
  })

  test("index が tags の範囲を超えるようなフォーカスの移動が起こらない", () => {
    const { handleKeydown } = useTagOrderList(tags, getHandleElementById)
    handleKeydown({ key: "ArrowUp", preventDefault: vi.fn() }, "id1")
    expect(getHandleElementById).not.toHaveBeenCalled()

    handleKeydown({ key: "ArrowDown", preventDefault: vi.fn() }, "id3")
    expect(getHandleElementById).not.toHaveBeenCalled()
  })

  test("index が tags の範囲を超えるような tag の移動が起こらない", () => {
    const { handleKeydown } = useTagOrderList(tags, getHandleElementById)
    handleKeydown({ key: "Enter", preventDefault: vi.fn() }, "id1")
    handleKeydown({ key: "ArrowUp", preventDefault: vi.fn() }, "id1")

    expect(tags.value).toEqual([
      { id: "id1", title: "tag1", order: 1 },
      { id: "id2", title: "tag2", order: 2 },
      { id: "id3", title: "tag3", order: 3 },
    ])

    handleKeydown({ key: "Enter", preventDefault: vi.fn() }, "id3")
    handleKeydown({ key: "ArrowDown", preventDefault: vi.fn() }, "id3")

    expect(tags.value).toEqual([
      { id: "id1", title: "tag1", order: 1 },
      { id: "id2", title: "tag2", order: 2 },
      { id: "id3", title: "tag3", order: 3 },
    ])
  })
})
