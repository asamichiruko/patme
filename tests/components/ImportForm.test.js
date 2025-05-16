import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import ImportForm from "@/components/ImportForm.vue"

const trigger = vi.fn()
vi.mock("@/composables/useNotification.js", () => {
  return { useNotification: () => ({ trigger }) }
})

describe("ImportForm.vue", () => {
  let model

  beforeEach(() => {
    vi.clearAllMocks()

    model = {
      importFromFile: vi.fn(),
    }
  })

  afterEach(() => {
    cleanup()
  })

  test("正常にファイルをインポートした後に成功通知が出る", async () => {
    render(ImportForm, {
      props: {
        importModel: model,
      },
    })

    const fileInput = screen.getByTestId("import-file", { hidden: true })

    const mockFile = new File(["{}"], "data.json", { type: "application/json" })
    mockFile.text = vi.fn().mockResolvedValue("{}")

    Object.defineProperty(fileInput, "files", {
      value: [mockFile],
      writable: true,
    })

    await fireEvent.update(fileInput)

    expect(model.importFromFile).toHaveBeenCalled()
    expect(trigger).toHaveBeenCalledWith(expect.any(String), "success")
  })

  test("json 形式でないファイルを選択したときにエラー通知が出る", async () => {
    render(ImportForm, {
      props: {
        importModel: model,
      },
    })

    const fileInput = screen.getByTestId("import-file", { hidden: true })

    const mockFile = new File(["text file"], "data.txt", { type: "text/plain" })
    mockFile.text = vi.fn().mockResolvedValue("text file")

    Object.defineProperty(fileInput, "files", {
      value: [mockFile],
      writable: true,
    })

    await fireEvent.update(fileInput)

    expect(model.importFromFile).not.toHaveBeenCalled()
    expect(trigger).toHaveBeenCalledWith(expect.any(String), "error")
  })

  test("ファイルの内容を読み込めなかったときにエラー通知が出る", async () => {
    render(ImportForm, {
      props: {
        importModel: model,
      },
    })

    const fileInput = screen.getByTestId("import-file", { hidden: true })

    model.importFromFile.mockImplementation(() => {
      throw new Error()
    })

    Object.defineProperty(fileInput, "files", {
      value: ["{}"],
      writable: true,
    })

    await fireEvent.update(fileInput)

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "error")
  })
})
