import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import RecordList from "@/components/RecordList.vue"

describe("RecordList.vue", () => {
  const testRecords = [
    {
      achievement: {
        id: "c2e0439a-7cd0-4743-a9ef-b299699f09a6",
        content: "テスト記録1",
        date: new Date("2025-04-01 15:00:00"),
      },
      stars: [],
    },
    {
      achievement: {
        id: "8adcf1ba-89d8-475f-b651-b14df49853eb",
        content: "テスト記録2",
        date: new Date("2025-04-01 16:00:00"),
      },
      stars: [
        {
          id: "13ac6ed5-e94e-4a56-8967-cc53d9c26eea",
          achievementId: "8adcf1ba-89d8-475f-b651-b14df49853eb",
          content: "スター1 (テスト記録2)",
          date: new Date("2025-04-01 16:30:00"),
        },
      ],
    },
  ]
  let recordModel

  beforeEach(() => {
    vi.clearAllMocks()
    recordModel = {
      subscribe: vi.fn(),
      addStar: vi.fn(() => true),
      getRecords: vi.fn(() => testRecords),
    }
  })

  afterEach(() => {
    cleanup()
  })

  test("records が 0 件のときその旨を示すメッセージが表示される", async () => {
    recordModel.getRecords.mockReturnValueOnce([])
    render(RecordList, {
      props: {
        recordModel,
      },
    })

    const text = await screen.findByText(/できたことを記録してみましょう/i)
    expect(text).toBeInTheDocument()
  })

  test("records の数だけ RecordListItem がレンダリングされる", async () => {
    render(RecordList, {
      props: {
        recordModel,
      },
      global: {
        stubs: {
          RecordListItem: {
            template: "<div data-testid='record-item'></div>",
          },
        },
      },
    })

    const items = await screen.findAllByTestId("record-item")
    expect(items).toHaveLength(testRecords.length)
  })

  test("コメントボタンを押してコメントを送信すると addStar が呼ばれる", async () => {
    render(RecordList, {
      props: {
        recordModel,
      },
      global: {
        stubs: {
          PromptDialog: {
            template: `<button @click="$emit('submit', 'test comment')">dummydialog</button>`,
          },
        },
      },
    })

    const commentButtons = await screen.findAllByRole("button", { name: "コメント" })
    await fireEvent.click(commentButtons[0])
    const achievementId = commentButtons[0].getAttribute("achievement-id")

    const fakeDialog = await screen.findByRole("button", { name: /dummydialog/i })
    await fireEvent.click(fakeDialog)

    expect(recordModel.addStar).toHaveBeenCalledWith({
      achievementId: achievementId,
      content: "test comment",
    })
  })
})
