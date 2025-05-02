import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import InputForm from "@/components/InputForm.vue"

const trigger = vi.fn()
vi.mock("@/composables/useNotification.js", () => {
  return { useNotification: () => ({ trigger }) }
})

describe("InputForm.vue", () => {
  let entryModel

  beforeEach(() => {
    vi.clearAllMocks()
    entryModel = {
      addAchievement: vi.fn(() => true),
    }
  })

  afterEach(() => {
    cleanup()
  })

  test("レンダリングされると textarea がフォーカスされる", async () => {
    render(InputForm, {
      props: {
        entryModel: entryModel,
      },
    })

    const textarea = screen.getByLabelText("達成内容")

    expect(document.activeElement).toContain(textarea)
  })

  test("テキストを記入して記録ボタンを押すと達成内容を記録できる", async () => {
    render(InputForm, {
      props: {
        entryModel: entryModel,
      },
    })

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, "テスト記録")

    const button = screen.getByRole("button", { name: "記録する" })
    await fireEvent.click(button)

    expect(entryModel.addAchievement).toHaveBeenCalledWith({ content: "テスト記録" })
  })

  test("テキストを記入して Ctrl+Enter を入力すると達成内容を記録できる", async () => {
    render(InputForm, {
      props: {
        entryModel: entryModel,
      },
    })

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, "テスト記録")

    await fireEvent.keyDown(textarea, {
      key: "Enter",
      code: "Enter",
      ctrlKey: true,
    })

    expect(entryModel.addAchievement).toHaveBeenCalledWith({ content: "テスト記録" })
  })

  test("記録に成功すると textarea がクリアされる", async () => {
    render(InputForm, {
      props: {
        entryModel: entryModel,
      },
    })

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, "テスト記録")

    const button = screen.getByRole("button", { name: "記録する" })
    await fireEvent.click(button)

    expect(textarea.value).toBe("")
  })

  test("記録に成功すると success 通知が出る", async () => {
    render(InputForm, {
      props: {
        entryModel: entryModel,
      },
    })

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, "テスト記録")

    await fireEvent.click(screen.getByRole("button", { name: "記録する" }))

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "success")
  })

  test("テキストを記入せずに送信した場合は達成内容を記録しない", async () => {
    render(InputForm, {
      props: {
        entryModel: entryModel,
      },
    })

    const button = screen.getByRole("button", { name: "記録する", hidden: false })
    await fireEvent.click(button)

    expect(entryModel.addAchievement).not.toHaveBeenCalled()
  })

  test("テキストを記入せずに送信すると error 通知が出る", async () => {
    render(InputForm, {
      props: {
        entryModel: entryModel,
      },
    })

    const button = screen.getByRole("button", { name: "記録する" })
    await fireEvent.click(button)

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "error")
  })

  test("記録に失敗すると textarea はクリアされない", async () => {
    entryModel.addAchievement.mockReturnValue(false)

    render(InputForm, {
      props: {
        entryModel: entryModel,
      },
    })

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, "テスト記録")

    const button = screen.getByRole("button", { name: "記録する", hidden: false })
    await fireEvent.click(button)

    expect(textarea.value).not.toBe("")
  })

  test("記録に失敗すると error 通知が出る", async () => {
    entryModel.addAchievement.mockReturnValue(false)

    render(InputForm, {
      props: {
        entryModel: entryModel,
      },
    })

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, "テスト記録")

    const button = screen.getByRole("button", { name: "記録する" })
    await fireEvent.click(button)

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "error")
  })
})
