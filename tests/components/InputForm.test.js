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

  test("テキストを記入して送信すると recordModel.addAchievement が呼ばれる", async () => {
    const textarea = wrapper.find("textarea")
    await textarea.setValue("テスト記録")

    const form = wrapper.find("form")
    await form.trigger("submit.prevent")

    expect(recordModel.addAchievement).toHaveBeenCalledWith({ content: "テスト記録" })
  })

  test("テキストを記入せずに送信すると recordModel.addAchievement は呼ばれない", async () => {
    const form = wrapper.find("form")
    await form.trigger("submit.prevent")

    expect(recordModel.addAchievement).not.toHaveBeenCalled()
  })

  test("テキストを記入せずに送信すると error 通知が出る", async () => {
    const form = wrapper.find("form")
    await form.trigger("submit.prevent")

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "error")
  })

  test("記録に成功すると textarea がクリアされる", async () => {
    const textarea = wrapper.find("textarea")
    await textarea.setValue("テスト記録")
    expect(textarea.element.value).toBe("テスト記録")

    const form = wrapper.find("form")
    await form.trigger("submit.prevent")

    expect(textarea.element.value).toBe("")
  })

  test("記録に成功すると success 通知が出る", async () => {
    const textarea = wrapper.find("textarea")
    await textarea.setValue("テスト記録")

    const form = wrapper.find("form")
    await form.trigger("submit.prevent")

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "success")
  })

  test("記録に失敗するとtextarea はクリアされない", async () => {
    recordModel.addAchievement.mockReturnValue(false)

    const textarea = wrapper.find("textarea")
    await textarea.setValue("テスト記録")

    const form = wrapper.find("form")
    await form.trigger("submit.prevent")

    expect(recordModel.addAchievement).toHaveReturnedWith(false)
    expect(textarea.element.value).not.toBe("")
  })

  test("記録に失敗すると error 通知が出る", async () => {
    recordModel.addAchievement.mockReturnValue(false)

    const textarea = wrapper.find("textarea")
    await textarea.setValue("テスト記録")

    const form = wrapper.find("form")
    await form.trigger("submit.prevent")

    expect(trigger).toHaveBeenCalledWith(expect.any(String), "error")
  })
})
