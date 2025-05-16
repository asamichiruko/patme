import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import ExportForm from "@/components/ExportForm.vue"

const trigger = vi.fn()
vi.mock("@/composables/useNotification.js", () => {
  return { useNotification: () => ({ trigger }) }
})

describe("ExportForm.vue", () => {
  let model

  beforeEach(() => {
    vi.clearAllMocks()

    model = {
      exportToFile: vi.fn(),
    }
  })

  afterEach(() => {
    cleanup()
  })

  test("データを正常にエクスポートすると success 通知が出る", async () => {
    vi.stubGlobal("URL", { createObjectURL: vi.fn(), revokeObjectURL: vi.fn() })

    render(ExportForm, {
      props: {
        exportModel: model,
      },
    })

    // window.location.href によるエラーを回避する
    const anchor = document.createElement("a")
    anchor.click = vi.fn()
    vi.spyOn(document, "createElement").mockReturnValueOnce(anchor)

    await fireEvent.click(screen.getByRole("button", { name: /エクスポート/i }))

    expect(model.exportToFile).toHaveBeenCalled()
    expect(trigger).toHaveBeenCalledWith(expect.any(String), "success")
  })
})
