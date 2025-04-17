import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import PromptDialog from "@/components/PromptDialog.vue"
import { expect } from "vitest"

describe("PromptDialog.vue", () => {
  const showModal = vi.fn()
  const close = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // jsdom に showModal/close メソッドが存在しないのでモック
    HTMLDialogElement.prototype.showModal = showModal
    HTMLDialogElement.prototype.close = close
  })

  afterEach(() => {
    cleanup()
  })

  test("ダイアログが正常に表示される", async () => {
    const mockSubmit = vi.fn()

    const { rerender } = render(PromptDialog, {
      props: {
        show: false,
        message: "test message",
        submittext: "submit",
        canceltext: "cancel",
        placeholder: "placeholder",
        onSubmit: mockSubmit,
      },
    })

    await rerender({
      show: true,
    })

    expect(showModal).toHaveBeenCalled()

    // dialog に open 属性をつけることで実際に表示する
    const dialog = await screen.findByRole("dialog", { hidden: true })
    dialog.open = true

    expect(dialog).toBeInTheDocument()
    expect(screen.getByText("test message")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "submit" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "cancel" })).toBeInTheDocument()
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  test("ボタンを押して送信するとダイアログが閉じられる", async () => {
    const mockSubmit = vi.fn()
    const mockOnUpdateShow = vi.fn()

    render(PromptDialog, {
      props: {
        show: true,
        submittext: "submit",
        onSubmit: mockSubmit,
        "onUpdate:show": mockOnUpdateShow,
      },
    })

    const dialog = await screen.findByRole("dialog", { hidden: true })
    dialog.open = true

    const text = await screen.findByRole("textbox")
    await fireEvent.update(text, "comment")

    const submitButton = await screen.findByRole("button", { name: "submit" })
    await fireEvent.click(submitButton)

    expect(mockSubmit).toHaveBeenCalled()
    expect(mockOnUpdateShow).toHaveBeenCalledWith(false)
  })

  test("ボタンを押してキャンセルするとダイアログが閉じられる", async () => {
    const mockCancel = vi.fn()
    const mockOnUpdateShow = vi.fn()

    render(PromptDialog, {
      props: {
        show: true,
        canceltext: "cancel",
        onCancel: mockCancel,
        "onUpdate:show": mockOnUpdateShow,
      },
    })

    const dialog = await screen.findByRole("dialog", { hidden: true })
    dialog.open = true

    const cancelButton = await screen.findByRole("button", { name: "cancel" })
    await fireEvent.click(cancelButton)

    expect(mockCancel).toHaveBeenCalled()
    expect(mockOnUpdateShow).toHaveBeenCalledWith(false)
  })
})
