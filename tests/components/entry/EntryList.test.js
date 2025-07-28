import { render, screen, cleanup } from "@testing-library/vue"
import EntryList from "@/components/entry/EntryList.vue"
import { createTestingPinia } from "@pinia/testing"
import * as entryStore from "@/stores/useEntryStore.js"

describe("EntryList.vue", () => {
  let getEntriesWithTagsMock

  beforeEach(() => {
    vi.clearAllMocks()

    getEntriesWithTagsMock = vi.fn()
    vi.spyOn(entryStore, "useEntryStore").mockReturnValue({
      getEntriesWithTags: getEntriesWithTagsMock,
    })
  })

  afterEach(() => {
    cleanup()
  })

  test("entries が 0 件のときその旨を示すメッセージが表示される", async () => {
    getEntriesWithTagsMock.mockReturnValue([])

    render(EntryList, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const text = await screen.findByText(/できたことを記録してみましょう/i)
    expect(text).toBeInTheDocument()
  })

  test("entries の数だけ EntryListItem がレンダリングされる", async () => {
    const testEntries = [
      {
        id: "entry1",
        content: "entry 1",
        date: "2025-04-01",
      },
      {
        id: "entry2",
        content: "entry 2",
        date: "2025-04-02",
      },
    ]
    getEntriesWithTagsMock.mockImplementation(() => {
      return [...testEntries].toSorted((a, b) => new Date(b.date) - new Date(a.date))
    })

    render(EntryList, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
        stubs: {
          EntryListItem: {
            props: ["entry"],
            template: `<div>{{ entry.content }}</div>`,
          },
        },
      },
    })

    const items = await screen.findAllByText(/entry/i)
    const renderedItems = items.map((el) => el.textContent)
    expect(items).toHaveLength(testEntries.length)
    // 日付降順に並ぶ
    expect(renderedItems[0]).toBe(testEntries[1].content)
    expect(renderedItems[1]).toBe(testEntries[0].content)
  })
})
