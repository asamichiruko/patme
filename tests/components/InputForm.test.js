import { render, screen, fireEvent, cleanup } from "@testing-library/vue"

const trigger = vi.hoisted(() => vi.fn())

vi.mock("@/composables/useNotification.js", () => {
  return {
    useNotification: () => ({
      trigger: trigger,
    }),
  }
})

import InputForm from "@/components/InputForm.vue"

describe("InputForm.vue", () => {
  let recordModel

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  test("テキストを記入して送信すると recordModel.addAchievement が呼ばれる", async () => {
    recordModel = {
      addAchievement: vi.fn().mockReturnValue(true),
    }
    render(InputForm, {
      props: {
        recordModel,
      },
    })

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, "テスト記録")

    const button = screen.getByRole("button", { name: "記録する" })
    await fireEvent.click(button)

    expect(recordModel.addAchievement).toHaveBeenCalledWith({ content: "テスト記録" })
  })

  test("テキストを記入せずに送信すると recordModel.addAchievement が呼ばれない", async () => {
    recordModel = {
      addAchievement: vi.fn().mockReturnValue(true),
    }
    render(InputForm, {
      props: {
        recordModel,
      },
    })

    const button = screen.getByRole("button", { name: "記録する" })
    await fireEvent.click(button)

    expect(recordModel.addAchievement).not.toHaveBeenCalled()
  })

  test("テキストを記入せずに送信すると error 通知が出る", async () => {
    recordModel = {
      addAchievement: vi.fn().mockReturnValue(true),
    }
    render(InputForm, {
      props: {
        recordModel,
      },
    })

    const button = screen.getByRole("button", { name: "記録する" })
    await fireEvent.click(button)

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "error")
  })

  test("記録に成功すると textarea がクリアされる", async () => {
    recordModel = {
      addAchievement: vi.fn().mockReturnValue(true),
    }
    render(InputForm, {
      props: {
        recordModel,
      },
    })

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, "テスト記録")

    const button = screen.getByRole("button", { name: "記録する" })
    await fireEvent.click(button)

    expect(textarea.value).toBe("")
  })

  test("記録に成功すると success 通知が出る", async () => {
    recordModel = {
      addAchievement: vi.fn().mockReturnValue(true),
    }
    render(InputForm, {
      props: {
        recordModel,
      },
    })

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, "テスト記録")

    const button = screen.getByRole("button", { name: "記録する" })
    await fireEvent.click(button)

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "success")
  })

  test("記録に失敗するとtextarea はクリアされない", async () => {
    recordModel = {
      addAchievement: vi.fn().mockReturnValue(false),
    }
    render(InputForm, {
      props: {
        recordModel,
      },
    })

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, "テスト記録")

    const button = screen.getByRole("button", { name: "記録する" })
    await fireEvent.click(button)

    expect(recordModel.addAchievement).toHaveReturnedWith(false)
    expect(textarea.value).not.toBe("")
  })

  test("記録に失敗すると error 通知が出る", async () => {
    recordModel = {
      addAchievement: vi.fn().mockReturnValue(false),
    }
    render(InputForm, {
      props: {
        recordModel,
      },
    })

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, "テスト記録")

    const button = screen.getByRole("button", { name: "記録する" })
    await fireEvent.click(button)

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "error")
  })
})
