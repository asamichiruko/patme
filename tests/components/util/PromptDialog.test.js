import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import PromptDialog from "@/components/util/PromptDialog.vue"
import { nextTick, ref } from "vue"

const isOpen = ref(false)
const params = ref({ defaultValue: "" })
const closePromptMock = vi.fn()

vi.mock("@/composables/usePromptDialog.js", () => ({
  usePromptDialog: () => ({
    isOpen,
    params,
    closePrompt: closePromptMock,
  }),
}))

describe("PromptDialog.vue", () => {
  const domShowModal = vi.fn()
  const domClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // jsdom に showModal/close メソッドが存在しないのでモック
    HTMLDialogElement.prototype.showModal = domShowModal
    HTMLDialogElement.prototype.close = domClose

    params.value = {
      defaultValue: "",
      entryType: "achievement",
    }
    isOpen.value = false
  })

  afterEach(() => {
    cleanup()
  })

  test("isOpen を true に設定するとダイアログが表示される", async () => {
    render(PromptDialog)

    isOpen.value = true
    await nextTick()
    expect(domShowModal).toHaveBeenCalled()

    // dialog に open 属性をつけることで実際に表示する
    const dialog = await screen.findByRole("dialog", { hidden: true })
    dialog.open = true

    expect(dialog).toBeVisible()
  })

  test("isOpen を false に設定するとダイアログが閉じられる", async () => {
    render(PromptDialog)

    // まず開いておく
    isOpen.value = true
    await nextTick()

    isOpen.value = false
    await nextTick()
    expect(domClose).toHaveBeenCalled()
  })

  test("キャンセルボタンを押すとダイアログが閉じられる", async () => {
    const { emitted } = render(PromptDialog)

    isOpen.value = true
    const dialog = screen.getByRole("dialog", { hidden: true })
    dialog.open = true

    const cancelButton = screen.getByRole("button", { name: /キャンセル/i })
    await fireEvent.click(cancelButton)

    expect(emitted()).toHaveProperty("cancel")
    expect(emitted().cancel[0]).toEqual([])
    expect(closePromptMock).toHaveBeenCalledWith(null)
  })

  test("ボタンを押して送信するとダイアログが閉じられる", async () => {
    const { emitted } = render(PromptDialog)

    isOpen.value = true
    await nextTick()
    const dialog = screen.getByRole("dialog", { hidden: true })
    dialog.open = true

    const textInput = screen.getByRole("textbox", { name: /ふりかえりコメント/i })
    await fireEvent.update(textInput, "text")

    const submitButton = screen.getByRole("button", { name: /記録する/i })
    await fireEvent.click(submitButton)

    expect(emitted()).toHaveProperty("submit")
    expect(emitted().submit[0]).toEqual([{ content: "text", reviewType: "achievement" }])
    expect(closePromptMock).toHaveBeenCalledWith({ content: "text", reviewType: "achievement" })
  })

  test("チェックボックスを使って再評価欄を開閉できる", async () => {
    render(PromptDialog)

    isOpen.value = true
    await nextTick()

    const reviewCheck = screen.getByLabelText(/記録の再評価/i)
    await fireEvent.click(reviewCheck)

    const reviewFormLabel = screen.getByText(/新しい評価/i)
    expect(reviewFormLabel).toBeInTheDocument()
  })

  test("入力後にダイアログを閉じて再び開くと以前の入力がクリアされる", async () => {
    render(PromptDialog)

    isOpen.value = true
    await nextTick()

    const reviewCheck = screen.getByLabelText(/記録の再評価/i)
    await fireEvent.click(reviewCheck)

    let achievementRadio = screen.getByLabelText(/嬉しい/i)
    let incompleteRadio = screen.getByLabelText(/モヤモヤ/i)
    await fireEvent.click(incompleteRadio)
    expect(achievementRadio).not.toBeChecked()
    expect(incompleteRadio).toBeChecked()

    // 新しい評価フォームを閉じて開く
    await fireEvent.click(reviewCheck)
    await fireEvent.click(reviewCheck)

    achievementRadio = screen.getByLabelText(/嬉しい/i)
    incompleteRadio = screen.getByLabelText(/モヤモヤ/i)
    expect(achievementRadio).toBeChecked()
    expect(incompleteRadio).not.toBeChecked()
  })
})
