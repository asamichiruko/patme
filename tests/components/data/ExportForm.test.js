import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import { createTestingPinia } from "@pinia/testing"
import * as notificationBar from "@/composables/useNotificationBar.js"
import * as dataTransferStore from "@/stores/useDataTransferStore.js"
import ExportForm from "@/components/data/ExportForm.vue"

describe("ExportForm.vue", () => {
  let triggerMock
  let exportToFileMock

  beforeEach(() => {
    vi.clearAllMocks()

    triggerMock = vi.fn()
    vi.spyOn(notificationBar, "useNotificationBar").mockReturnValue({
      trigger: triggerMock,
    })

    exportToFileMock = vi.fn()
    vi.spyOn(dataTransferStore, "useDataTransferStore").mockReturnValue({
      exportToFile: exportToFileMock,
    })
  })

  afterEach(() => {
    cleanup()
  })

  test("データを正常にエクスポートすると success 通知が出る", async () => {
    vi.stubGlobal("URL", { createObjectURL: vi.fn(), revokeObjectURL: vi.fn() })

    render(ExportForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    // window.location.href によるエラーを回避する
    const anchor = document.createElement("a")
    anchor.click = vi.fn()
    vi.spyOn(document, "createElement").mockReturnValueOnce(anchor)

    await fireEvent.click(screen.getByRole("button", { name: /エクスポート/i }))

    expect(exportToFileMock).toHaveBeenCalled()
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "success")
  })
})
