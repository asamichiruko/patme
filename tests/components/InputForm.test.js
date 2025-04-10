import { mount } from "@vue/test-utils"

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
  let wrapper
  let recordModel

  beforeEach(() => {
    recordModel = {
      addAchievement: vi.fn().mockReturnValue(true),
    }
    wrapper = mount(InputForm, {
      props: {
        recordModel,
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
    vi.restoreAllMocks()
  })

  test("フォームに入力して「記録する」ボタンを押すと recordModel.addAchievement が呼ばれる", async () => {
    const textarea = wrapper.find("textarea")
    await textarea.setValue("テスト記録")

    const button = wrapper.find("button")
    await button.trigger("click")

    expect(recordModel.addAchievement).toHaveBeenCalledWith({ content: "テスト記録" })
  })

  test("フォームが空の状態で「記録する」ボタンを押すと recordModel.addAchievement が呼ばれない", async () => {
    const button = wrapper.find("button")
    await button.trigger("click")

    expect(recordModel.addAchievement).not.toHaveBeenCalled()
  })

  test("フォームが空の状態で「記録する」ボタンを押すと error 通知が出る", async () => {
    const button = wrapper.find("button")
    await button.trigger("click")

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "error")
  })

  test("記録が成功するとフォームがクリアされる", async () => {
    const textarea = wrapper.find("textarea")
    await textarea.setValue("テスト記録")
    expect(textarea.element.value).toBe("テスト記録")

    const button = wrapper.find("button")
    await button.trigger("click")

    expect(textarea.element.value).toBe("")
  })

  test("記録が成功すると success 通知が出る", async () => {
    const textarea = wrapper.find("textarea")
    await textarea.setValue("テスト記録")

    const button = wrapper.find("button")
    await button.trigger("click")

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "success")
  })

  test("記録が失敗するとフォームがクリアされない", async () => {
    recordModel.addAchievement.mockReturnValue(false)

    const textarea = wrapper.find("textarea")
    await textarea.setValue("テスト記録")

    const button = wrapper.find("button")
    await button.trigger("click")

    expect(recordModel.addAchievement).toHaveReturnedWith(false)
    expect(textarea.element.value).not.toBe("")
  })

  test("記録が失敗すると error 通知が出る", async () => {
    recordModel.addAchievement.mockReturnValue(false)

    const textarea = wrapper.find("textarea")
    await textarea.setValue("テスト記録")

    const button = wrapper.find("button")
    await button.trigger("click")

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "error")
  })
})
