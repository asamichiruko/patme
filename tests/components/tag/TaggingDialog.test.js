import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import TaggingDialog from "@/components/tag/TaggingDialog.vue"
import * as tagStore from "@/stores/useTagStore.js"
import { createTestingPinia } from "@pinia/testing"
import { nextTick, ref } from "vue"

const isOpen = ref(false)
const params = ref({ initialTagIds: [] })
const closeMock = vi.fn()

vi.mock("@/composables/useTaggingDialog.js", () => ({
  useTaggingDialog: () => ({
    isOpen,
    params,
    closeTaggingDialog: closeMock,
  }),
}))

describe("TaggingDialog.vue", () => {
  const domShowModal = vi.fn()
  const domClose = vi.fn()
  let getTagsOrderedMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // jsdom に showModal/close メソッドが存在しないのでモック
    HTMLDialogElement.prototype.showModal = domShowModal
    HTMLDialogElement.prototype.close = domClose

    vi.spyOn(tagStore, "useTagStore").mockReturnValue({
      getTagsOrdered: getTagsOrderedMock,
    })
    params.value = { initialTagIds: [] }
    isOpen.value = false
  })

  afterEach(() => {
    cleanup()
  })

  test("isOpen を true に設定するとダイアログが表示される", async () => {
    render(TaggingDialog, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    isOpen.value = true
    await nextTick()
    expect(domShowModal).toHaveBeenCalled()

    // dialog に open 属性を加えることで実際に表示する
    const dialog = screen.getByRole("dialog", { hidden: true })
    dialog.open = true

    expect(dialog).toBeVisible()
  })

  test("isOpen を false に設定するとダイアログが閉じられる", async () => {
    render(TaggingDialog, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    // 一旦ダイアログを開く
    isOpen.value = true
    await nextTick()

    isOpen.value = false
    await nextTick()
    expect(domClose).toHaveBeenCalled()
  })

  test("キャンセルボタンを押すとダイアログが閉じられる", async () => {
    const { emitted } = render(TaggingDialog, {
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

    const cancelButton = screen.getByRole("button", { name: /キャンセル/i })
    await fireEvent.click(cancelButton)

    expect(emitted()).toHaveProperty("cancel")
    expect(emitted().cancel[0]).toEqual([])
    expect(closeMock).toHaveBeenCalledWith(null)
  })

  test("すべてのタグに対応するピルボタンが表示される", async () => {
    getTagsOrderedMock.mockReturnValue([
      { id: "tag1", title: "tag 1" },
      { id: "tag2", title: "tag 2" },
    ])
    const allTagTitles = getTagsOrderedMock().map((tag) => tag.title)

    render(TaggingDialog, {
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

    const pillButtons = screen.queryAllByRole("button", { name: /tag/i })
    const pillButtonNames = pillButtons.map((el) => el.textContent)

    expect(pillButtonNames).toEqual(allTagTitles)
  })

  test("initialTagIds で指定した初期状態が反映される", async () => {
    getTagsOrderedMock.mockReturnValue([
      { id: "tag1", title: "tag 1" },
      { id: "tag2", title: "tag 2" },
    ])
    params.value = { initialTagIds: ["tag1"] }

    render(TaggingDialog, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    isOpen.value = true
    await nextTick()
    const dialog = screen.getByRole("dialog", { hidden: true })
    dialog.open = true

    const pillButton1 = screen.getByRole("button", { name: /tag 1/i })
    const pillButton2 = screen.getByRole("button", { name: /tag 2/i })

    expect(pillButton1).toHaveAttribute("aria-pressed", "true")
    expect(pillButton2).toHaveAttribute("aria-pressed", "false")
  })

  test("ピルボタンを押すと選択状態がトグルされる", async () => {
    getTagsOrderedMock.mockReturnValue([
      { id: "tag1", title: "tag 1" },
      { id: "tag2", title: "tag 2" },
    ])
    params.value = { initialTagIds: ["tag1"] }

    render(TaggingDialog, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    isOpen.value = true
    await nextTick()
    const dialog = screen.getByRole("dialog", { hidden: true })
    dialog.open = true

    const pillButton1 = screen.getByRole("button", { name: /tag 1/i })
    const pillButton2 = screen.getByRole("button", { name: /tag 2/i })

    await fireEvent.click(pillButton1)
    await fireEvent.click(pillButton2)

    expect(pillButton1).toHaveAttribute("aria-pressed", "false")
    expect(pillButton2).toHaveAttribute("aria-pressed", "true")
  })

  test("決定ボタンを押すと選択状態が emit される", async () => {
    getTagsOrderedMock.mockReturnValue([
      { id: "tag1", title: "tag 1" },
      { id: "tag2", title: "tag 2" },
    ])
    params.value = { initialTagIds: [] }
    await nextTick()

    const { emitted } = render(TaggingDialog, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    isOpen.value = true
    await nextTick()
    const dialog = screen.getByRole("dialog", { hidden: true })
    dialog.open = true

    const pillButton1 = screen.getByRole("button", { name: /tag 1/i })
    await fireEvent.click(pillButton1)

    const submitButton = screen.getByRole("button", { name: /決定/i })
    await fireEvent.click(submitButton)

    expect(emitted()).toHaveProperty("submit")
    expect(emitted().submit[0]).toEqual([["tag1"]])
    expect(closeMock).toHaveBeenCalledWith(["tag1"])
  })
})
