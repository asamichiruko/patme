import InputForm from "@/components/InputForm.vue"
import { mount } from "@vue/test-utils"

describe("InputForm.vue", () => {
  test("フォームに入力して「記録する」ボタンを押すと recordModel.addAchievement が呼ばれる", async () => {
    const mockRecordModel = {
      addAchievement: vi.fn(),
    }
    const wrapper = mount(InputForm, {
      props: {
        recordModel: mockRecordModel,
      },
    })

    const textarea = wrapper.find("textarea")
    await textarea.setValue("テスト記録")

    const button = wrapper.find("button")
    await button.trigger("click")

    expect(mockRecordModel.addAchievement).toHaveBeenCalledWith({ content: "テスト記録" })
  })
})
