import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/vue"
import SettingsForm from "@/components/SettingsForm.vue"
import App from "@/App.vue"

describe("SettingsForm.vue", () => {
  let model
  let mockFile

  beforeEach(() => {
    vi.clearAllMocks()

    model = {
      getAllTags: vi.fn(),
      exportAsJson: vi.fn(),
      importFromJson: vi.fn(),
    }
  })

  afterEach(() => {
    cleanup()
  })

  test("データを正常にエクスポートすると success 通知が出る", async () => {
    vi.stubGlobal("URL", { createObjectURL: vi.fn(), revokeObjectURL: vi.fn() })

    render(App, {
      props: {
        entryModel: model,
      },
      global: {
        stubs: {
          InputAndListView: {
            template: "<div></div>",
          },
          TagManager: {
            template: "<div></div>",
          },
        },
      },
    })
    await fireEvent.click(screen.getByRole("button", { name: "設定" }))

    // window.location.href によるエラーを回避する
    const anchor = document.createElement("a")
    anchor.click = vi.fn()
    vi.spyOn(document, "createElement").mockReturnValueOnce(anchor)

    await fireEvent.click(screen.getByRole("button", { name: /エクスポート/i }))

    expect(model.exportAsJson).toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.getByText(/エクスポートしました/i)).toBeInTheDocument()
    })
  })

  test("ファイルを選択すると entryModel.importEntries が呼ばれる", async () => {
    render(SettingsForm, {
      props: {
        entryModel: model,
      },
      global: {
        stubs: {
          TagManager: {
            template: "<div></div>",
          },
        },
      },
    })

    const fileInput = screen.getByTestId("import-file", { hidden: true })

    mockFile = new File(["{}"], "data.json", { type: "application/json" })
    mockFile.text = vi.fn().mockResolvedValue("{}")

    Object.defineProperty(fileInput, "files", {
      value: [mockFile],
      writable: true,
    })

    await fireEvent.update(fileInput)

    expect(model.importFromJson).toHaveBeenCalled()
  })

  test("json 形式でないファイルを選択したときにエラー通知が出る", async () => {
    render(App, {
      props: {
        entryModel: model,
      },
      global: {
        stubs: {
          InputAndListView: {
            template: "<div></div>",
          },
          TagManager: {
            template: "<div></div>",
          },
        },
      },
    })
    await fireEvent.click(screen.getByRole("button", { name: "設定" }))

    const fileInput = screen.getByTestId("import-file", { hidden: true })

    mockFile = new File(["text file"], "data.txt", { type: "text/plain" })
    mockFile.text = vi.fn().mockResolvedValue("text file")

    Object.defineProperty(fileInput, "files", {
      value: [mockFile],
      writable: true,
    })

    await fireEvent.update(fileInput)

    await waitFor(() => {
      expect(screen.getByText(/json 形式のファイルを選択してください/i)).toBeInTheDocument()
    })
  })

  test("ファイルの内容を読み込めなかったときにエラー通知が出る", async () => {
    render(App, {
      props: {
        entryModel: model,
      },
      global: {
        stubs: {
          InputAndListView: {
            template: "<div></div>",
          },
          TagManager: {
            template: "<div></div>",
          },
        },
      },
    })
    await fireEvent.click(screen.getByRole("button", { name: "設定" }))

    const fileInput = screen.getByTestId("import-file", { hidden: true })

    mockFile = new File(["{}"], "data.json", { type: "application/json" })
    mockFile.text = vi.fn().mockRejectedValue()

    Object.defineProperty(fileInput, "files", {
      value: [mockFile],
      writable: true,
    })

    await fireEvent.update(fileInput)

    await waitFor(() => {
      expect(screen.getByText(/データの復元に失敗しました/i)).toBeInTheDocument()
    })
  })

  test("ファイルのパースに失敗したときにエラー通知が出る", async () => {
    render(App, {
      props: {
        entryModel: model,
      },
      global: {
        stubs: {
          InputAndListView: {
            template: "<div></div>",
          },
          TagManager: {
            template: "<div></div>",
          },
        },
      },
    })
    await fireEvent.click(screen.getByRole("button", { name: "設定" }))

    const fileInput = screen.getByTestId("import-file", { hidden: true })

    mockFile = new File(["invalid json file"], "data.json", {
      type: "application/json",
    })
    mockFile.text = vi.fn().mockResolvedValue("invalid json file")

    Object.defineProperty(fileInput, "files", {
      value: [mockFile],
      writable: true,
    })

    await fireEvent.update(fileInput)

    await waitFor(() => {
      expect(screen.getByText(/データの復元に失敗しました/i)).toBeInTheDocument()
    })
  })

  test("JSON ファイルが不正な型だったときにエラー通知が出る", async () => {
    model.importFromJson.mockImplementation(() => {
      throw new SyntaxError()
    })
    render(App, {
      props: {
        entryModel: model,
      },
      global: {
        stubs: {
          InputAndListView: {
            template: "<div></div>",
          },
          TagManager: {
            template: "<div></div>",
          },
        },
      },
    })
    await fireEvent.click(screen.getByRole("button", { name: "設定" }))

    const fileInput = screen.getByTestId("import-file", { hidden: true })

    mockFile = new File(["{}"], "data.json", { type: "application/json" })
    mockFile.text = vi.fn().mockResolvedValue("{}")

    Object.defineProperty(fileInput, "files", {
      value: [mockFile],
      writable: true,
    })

    await fireEvent.update(fileInput)

    await waitFor(() => {
      expect(screen.getByText(/データの復元に失敗しました/i)).toBeInTheDocument()
    })
  })
})
