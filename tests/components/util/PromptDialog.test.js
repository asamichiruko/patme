import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import PromptDialog from "@/components/util/PromptDialog.vue"
import { createTestingPinia } from "@pinia/testing"
import { nextTick, ref } from "vue"

const activeDialog = ref(null)
const dialogParams = ref({ initialTagIds: [] })
const closeMock = vi.fn()

vi.mock("@/composables/useDialogStore.js", () => ({
  useDialogStore: () => ({
    activeDialog,
    dialogParams,
    close: closeMock,
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

    dialogParams.value = {
      message: "message",
      submittext: "OK",
      canceltext: "Cancel",
      placeholder: "placeholder",
    }
    activeDialog.value = null
  })

  afterEach(() => {
    cleanup()
  })

  test("activeDialog を prompt に設定するとダイアログが表示される", async () => {
    render(PromptDialog, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    activeDialog.value = "prompt"
    await nextTick()
    expect(domShowModal).toHaveBeenCalled()

    // dialog に open 属性をつけることで実際に表示する
    const dialog = await screen.findByRole("dialog", { hidden: true })
    dialog.open = true

    expect(dialog).toBeVisible()
  })

  test("activeDialog を prompt 以外に設定するとダイアログが表示されない", async () => {
    render(PromptDialog, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    activeDialog.value = "tagging"
    await nextTick(() => {
      expect(domClose).toHaveBeenCalled()
    })
  })

  test("キャンセルボタンを押すとダイアログが閉じられる", async () => {
    const { emitted } = render(PromptDialog, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const dialog = screen.getByRole("dialog", { hidden: true })
    dialog.open = true

    const cancelButton = screen.getByRole("button", { name: /cancel/i })
    await fireEvent.click(cancelButton)

    expect(emitted()).toHaveProperty("cancel")
    expect(emitted().cancel[0]).toEqual([])
    expect(closeMock).toHaveBeenCalledWith(null)
  })

  test("ボタンを押して送信するとダイアログが閉じられる", async () => {
    const { emitted } = render(PromptDialog, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    activeDialog.value = "prompt"
    await nextTick()
    const dialog = screen.getByRole("dialog", { hidden: true })
    dialog.open = true

    const textInput = screen.getByRole("textbox", { name: /message/i })
    await fireEvent.update(textInput, "text")

    const submitButton = screen.getByRole("button", { name: /OK/i })
    await fireEvent.click(submitButton)

    expect(emitted()).toHaveProperty("submit")
    expect(emitted().submit[0]).toEqual(["text"])
    expect(closeMock).toHaveBeenCalledWith("text")
  })
})
