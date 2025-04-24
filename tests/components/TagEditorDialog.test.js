import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import TagEditorDialog from "@/components/TagEditorDialog.vue"

describe("TagEditorDialog.vue", () => {
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

    const { rerender } = render(TagEditorDialog, {
      props: {
        show: false,
        allTags: [],
        initialTagIds: [],
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
    expect(screen.getByRole("button", { name: /決定/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /キャンセル/i })).toBeInTheDocument()
  })

  test("ボタンを押してキャンセルするとダイアログが閉じられる", async () => {
    const mockCancel = vi.fn()
    const mockOnUpdateShow = vi.fn()

    render(TagEditorDialog, {
      props: {
        show: true,
        allTags: [],
        initialTagIds: [],
        onCancel: mockCancel,
        "onUpdate:show": mockOnUpdateShow,
      },
    })

    const dialog = await screen.findByRole("dialog", { hidden: true })
    dialog.open = true

    const cancelButton = await screen.findByRole("button", { name: /キャンセル/i })
    await fireEvent.click(cancelButton)

    expect(mockCancel).toHaveBeenCalled()
    expect(mockOnUpdateShow).toHaveBeenCalledWith(false)
  })

  test("initialTagIds を与えて選択状態を初期化できる", async () => {
    render(TagEditorDialog, {
      props: {
        show: true,
        allTags: [
          { id: "id1", title: "tag1" },
          { id: "id2", title: "tag2" },
        ],
        initialTagIds: ["id1"],
      },
    })

    const dialog = await screen.findByRole("dialog", { hidden: true })
    dialog.open = true

    const tagButton1 = await screen.findByRole("button", { name: "tag1" })
    const tagButton2 = await screen.findByRole("button", { name: "tag2" })

    expect(tagButton1).toHaveAttribute("aria-pressed", "true")
    expect(tagButton2).toHaveAttribute("aria-pressed", "false")
  })

  test("タグボタンを押して選択状態をトグルできる", async () => {
    render(TagEditorDialog, {
      props: {
        show: true,
        allTags: [{ id: "id1", title: "tag1" }],
        initialTagIds: [],
      },
    })

    const dialog = await screen.findByRole("dialog", { hidden: true })
    dialog.open = true

    const tagButton1 = await screen.findByRole("button", { name: "tag1" })
    await fireEvent.click(tagButton1)

    expect(tagButton1).toHaveAttribute("aria-pressed", "true")
  })

  test("新しいタグの追加リクエストを送れる", async () => {
    const { emitted } = render(TagEditorDialog, {
      props: {
        show: true,
        allTags: [],
        initialTagIds: [],
      },
    })

    const dialog = await screen.findByRole("dialog", { hidden: true })
    dialog.open = true

    const newTagInput = await screen.findByRole("textbox", { name: /タグを追加/i })
    await fireEvent.update(newTagInput, "TestTag")

    const addTagButton = await screen.findByRole("button", { name: /追加/i })
    await fireEvent.click(addTagButton)

    expect(emitted()["add-tag"]).toBeTruthy()
    expect(emitted()["add-tag"][0]).toEqual(["TestTag"])
  })
})
