import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import { createTestingPinia } from "@pinia/testing"
import * as notificationBar from "@/composables/useNotificationBar.js"
import * as dataTransferStore from "@/stores/useDataTransferStore.js"
import ImportForm from "@/components/data/ImportForm.vue"

describe("ImportForm.vue", () => {
  let triggerMock
  let importFromFileMock

  beforeEach(() => {
    vi.clearAllMocks()

    triggerMock = vi.fn()
    vi.spyOn(notificationBar, "useNotificationBar").mockReturnValue({
      trigger: triggerMock,
    })

    importFromFileMock = vi.fn()
    vi.spyOn(dataTransferStore, "useDataTransferStore").mockReturnValue({
      importFromFile: importFromFileMock,
    })
  })

  afterEach(() => {
    cleanup()
  })

  test("JSON 形式のファイルが正常にインポートされる", async () => {
    render(ImportForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
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

    expect(importFromFileMock).toHaveBeenCalled()
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "success")
  })

  test("json 形式でないファイルを選択したときにエラーメッセージが通知される", async () => {
    render(ImportForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
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

    expect(importFromFileMock).not.toHaveBeenCalled()
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "error")
  })

  test("ファイルの内容を読み込めなかったときにエラーメッセージが通知される", async () => {
    render(ImportForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const fileInput = screen.getByTestId("import-file", { hidden: true })

    const mockFile = new File(["{}"], "data.json", { type: "application/json" })
    mockFile.text = vi.fn().mockRejectedValue(new Error("text() error"))

    Object.defineProperty(fileInput, "files", {
      value: [mockFile],
      writable: true,
    })

    importFromFileMock.mockRejectedValue(new Error("importFromFile() error"))

    await fireEvent.update(fileInput)

    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "error")
  })
})
