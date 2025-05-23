import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import EntryList from "@/components/EntryList.vue"

describe("EntryList.vue", () => {
  const testEntries = [
    {
      id: "c2e0439a-7cd0-4743-a9ef-b299699f09a6",
      content: "テスト記録1",
      date: new Date("2025-04-01 15:00:00"),
      stars: [],
      tags: [
        {
          id: "5ade7aff-2c3e-48ca-8ad2-5cd8fdae3e0c",
          achievementId: "8adcf1ba-89d8-475f-b651-b14df49853eb",
          title: "テストタグ1",
        },
      ],
    },
    {
      id: "8adcf1ba-89d8-475f-b651-b14df49853eb",
      content: "テスト記録2",
      date: new Date("2025-04-01 16:00:00"),
      stars: [
        {
          id: "13ac6ed5-e94e-4a56-8967-cc53d9c26eea",
          achievementId: "8adcf1ba-89d8-475f-b651-b14df49853eb",
          content: "スター1 (テスト記録2)",
          date: new Date("2025-04-01 16:30:00"),
        },
      ],
      tags: [],
    },
  ]

  let entryModel
  let tagModel
  let taggingModel

  beforeEach(() => {
    vi.clearAllMocks()
    entryModel = {
      addStar: vi.fn(() => true),
      getEntriesWithTags: vi.fn(() => testEntries),
    }
    tagModel = {
      addTag: vi.fn(),
      getTagsOrdered: vi.fn(() => [
        { id: "8adcf1ba-89d8-475f-b651-b14df49853eb", title: "テストタグ1", order: 1 },
      ]),
    }
    taggingModel = {
      updateTaggings: vi.fn(),
    }
  })

  afterEach(() => {
    cleanup()
  })

  test("entries が 0 件のときその旨を示すメッセージが表示される", async () => {
    entryModel.getEntriesWithTags.mockReturnValueOnce([])
    render(EntryList, {
      props: {
        entryModel: entryModel,
        tagModel: tagModel,
        taggingModel: taggingModel,
      },
    })

    const text = await screen.findByText(/できたことを記録してみましょう/i)
    expect(text).toBeInTheDocument()
  })

  test("entries の数だけ EntryListItem がレンダリングされる", async () => {
    render(EntryList, {
      props: {
        entryModel: entryModel,
        tagModel: tagModel,
        taggingModel: taggingModel,
      },
      global: {
        stubs: {
          EntryListItem: {
            template: "<div data-testid='entry-item'></div>",
          },
        },
      },
    })

    const items = await screen.findAllByTestId("entry-item")
    expect(items).toHaveLength(testEntries.length)
  })

  test("コメントボタンを押してコメントを送信すると addStar が呼ばれる", async () => {
    render(EntryList, {
      props: {
        entryModel: entryModel,
        tagModel: tagModel,
        taggingModel: taggingModel,
      },
      global: {
        stubs: {
          PromptDialog: {
            template: `<button @click="$emit('submit', 'test comment')">DummyPromptDialog</button>`,
          },
        },
      },
    })

    const commentButtons = await screen.findAllByRole("button", { name: /コメント/i })
    await fireEvent.click(commentButtons[0])

    const fakeDialog = await screen.findByRole("button", { name: /DummyPromptDialog/i })
    await fireEvent.click(fakeDialog)

    expect(entryModel.addStar).toHaveBeenCalledWith({
      achievementId: expect.any(String),
      content: "test comment",
      date: expect.any(Date),
    })
  })

  test("タグ編集ボタンを押して決定すると updateTaggings が呼ばれる", async () => {
    render(EntryList, {
      props: {
        entryModel: entryModel,
        tagModel: tagModel,
        taggingModel: taggingModel,
      },
      global: {
        stubs: {
          TaggingDialog: {
            template: `<button @click="$emit('submit', ['id1', 'id2'])">DummyTaggingDialog</button>`,
          },
        },
      },
    })

    const tagButtons = await screen.findAllByRole("button", { name: /タグ/i })
    await fireEvent.click(tagButtons[0])

    const fakeDialog = await screen.findByRole("button", { name: /DummyTaggingDialog/i })
    await fireEvent.click(fakeDialog)

    expect(taggingModel.updateTaggings).toHaveBeenCalledWith({
      achievementId: expect.any(String),
      tagIds: ["id1", "id2"],
    })
  })

  test("新規タグを追加すると addTag が呼ばれる", async () => {
    render(EntryList, {
      props: {
        entryModel: entryModel,
        tagModel: tagModel,
        taggingModel: taggingModel,
      },
      global: {
        stubs: {
          TaggingDialog: {
            template: `<button @click="$emit('add-tag', 'newTag')">追加</button>`,
          },
        },
      },
    })

    const tagButtons = await screen.findAllByRole("button", { name: /タグ/i })
    await fireEvent.click(tagButtons[0])

    const fakeDialog = await screen.findByRole("button", { name: /追加/i })
    await fireEvent.click(fakeDialog)

    expect(tagModel.addTag).toHaveBeenCalledWith({ title: "newTag" })
  })
})
