import { render, screen, cleanup } from "@testing-library/vue"
import { mount } from "@vue/test-utils"
import TagManager from "@/components/TagManager.vue"

describe("TagEditorDialog.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  test("正常にタグリストを初期化できる", async () => {
    const tags = [
      { id: "id1", title: "tag1", order: 1 },
      { id: "id2", title: "tag2", order: 2 },
    ]

    render(TagManager, {
      props: {
        allTags: tags,
      },
    })

    const items = await screen.findAllByRole("listitem")
    const titles = items.map((el) => el.textContent.trim())

    expect(titles).toEqual(["tag1", "tag2"])
  })

  test("リストを並び替えた後に順序を保存できる", async () => {
    const tags = [
      { id: "id1", title: "tag1", order: 1 },
      { id: "id2", title: "tag2", order: 2 },
    ]

    const wrapper = mount(TagManager, {
      props: {
        allTags: tags,
      },
    })

    try {
      wrapper.vm.reorderedTags = [tags[1], tags[0]]

      wrapper.vm.confirmReorder()

      const emits = wrapper.emitted("save")
      expect(emits).toHaveLength(1)
      const reorderedTags = emits[0][0]
      expect(reorderedTags[0].id).toBe("id2")
      expect(reorderedTags[1].id).toBe("id1")
      expect(reorderedTags[0].order).toBe(1)
      expect(reorderedTags[1].order).toBe(2)
    } finally {
      wrapper.unmount()
    }
  })

  test("リストを並び替えた後にキャンセルして状態を戻せる", async () => {
    const tags = [
      { id: "id1", title: "tag1", order: 1 },
      { id: "id2", title: "tag2", order: 2 },
    ]

    const wrapper = mount(TagManager, {
      props: {
        allTags: tags,
      },
    })

    try {
      wrapper.vm.reorderedTags = [tags[1], tags[0]]

      wrapper.vm.discardReorder()

      const resetedTags = wrapper.vm.reorderedTags
      expect(resetedTags[0].id).toBe("id1")
      expect(resetedTags[1].id).toBe("id2")
      expect(resetedTags[0].order).toBe(1)
      expect(resetedTags[1].order).toBe(2)
    } finally {
      wrapper.unmount()
    }
  })
})
