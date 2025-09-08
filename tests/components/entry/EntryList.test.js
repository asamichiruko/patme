import { render, screen, cleanup, fireEvent } from "@testing-library/vue"
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

    const testEntries = [
      {
        id: "entry1",
        content: "entry achievement",
        entryType: "achievement",
        reviewedCount: 0,
        date: "2025-04-01",
      },
      {
        id: "entry2",
        content: "entry incomplete",
        entryType: "incomplete",
        reviewedCount: 0,
        date: "2025-04-02",
      },
      {
        id: "entry3",
        content: "entry accepted",
        entryType: "accepted",
        reviewedCount: 0,
        date: "2025-04-03",
      },
      {
        id: "entry1",
        content: "entry achievement reviewed",
        entryType: "achievement",
        reviewedCount: 1,
        date: "2025-04-04",
      },
      {
        id: "entry2",
        content: "entry incomplete reviewed",
        entryType: "incomplete",
        reviewedCount: 1,
        date: "2025-04-05",
      },
      {
        id: "entry3",
        content: "entry accepted reviewed",
        entryType: "accepted",
        reviewedCount: 1,
        date: "2025-04-06",
      },
    ]
    getEntriesWithTagsMock.mockImplementation(() => {
      return [...testEntries]
    })
  })

  afterEach(() => {
    cleanup()
  })

  test("entries が 0 件のときその旨を示すメッセージが表示される", async () => {
    getEntriesWithTagsMock.mockReturnValueOnce([])

    render(EntryList, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const text = await screen.findByText(/記録してみましょう/i)
    expect(text).toBeInTheDocument()
  })

  test("フィルタが「すべて」のとき全 entries が表示される", async () => {
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

    const filterOptionAll = screen.getByRole("radio", { name: /すべて/i })
    await fireEvent.click(filterOptionAll)

    const items = await screen.findAllByText(/entry/i)
    const renderedItems = items.map((el) => el.textContent)
    expect(items).toHaveLength(6)
    // 日付降順に並ぶ
    expect(renderedItems).toEqual([
      "entry accepted reviewed",
      "entry incomplete reviewed",
      "entry achievement reviewed",
      "entry accepted",
      "entry incomplete",
      "entry achievement",
    ])
  })

  test("フィルタが「ふりかえり済み」のとき reviewed である entries が表示される", async () => {
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

    const filterOptionReviewed = screen.getByRole("radio", { name: /ふりかえり済み/i })
    await fireEvent.click(filterOptionReviewed)

    const items = await screen.findAllByText(/entry/i)
    const renderedItems = items.map((el) => el.textContent)
    expect(items).toHaveLength(3)
    expect(renderedItems).toEqual([
      "entry accepted reviewed",
      "entry incomplete reviewed",
      "entry achievement reviewed",
    ])
  })

  test("フィルタが「よかったこと」のとき achievement である entries が表示される", async () => {
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

    const filterOptionAll = screen.getByRole("radio", { name: /よかったこと/i })
    await fireEvent.click(filterOptionAll)

    const items = await screen.findAllByText(/entry/i)
    const renderedItems = items.map((el) => el.textContent)
    expect(items).toHaveLength(2)
    expect(renderedItems).toEqual(["entry achievement reviewed", "entry achievement"])
  })

  test("フィルタが「ふりかえりたいこと」のとき incomplete である entries が表示される", async () => {
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

    const filterOptionAll = screen.getByRole("radio", { name: /ふりかえりたいこと/i })
    await fireEvent.click(filterOptionAll)

    const items = await screen.findAllByText(/entry/i)
    const renderedItems = items.map((el) => el.textContent)
    expect(items).toHaveLength(2)
    // 日付降順に並ぶ
    expect(renderedItems).toEqual(["entry incomplete reviewed", "entry incomplete"])
  })

  test("フィルタが「気づいたこと」のとき accepted である entries が表示される", async () => {
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

    const filterOptionAll = screen.getByRole("radio", { name: /気づいたこと/i })
    await fireEvent.click(filterOptionAll)

    const items = await screen.findAllByText(/entry/i)
    const renderedItems = items.map((el) => el.textContent)
    expect(items).toHaveLength(2)
    expect(renderedItems).toEqual(["entry accepted reviewed", "entry accepted"])
  })
})
