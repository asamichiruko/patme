import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import EntryForm from "@/components/entry/EntryForm.vue"
import * as notificationBar from "@/composables/useNotificationBar.js"
import * as entryStore from "@/stores/useEntryStore.js"
import { createTestingPinia } from "@pinia/testing"

describe("EntryForm.vue", () => {
  let triggerMock
  let addAchievementMock

  beforeEach(() => {
    vi.clearAllMocks()

    triggerMock = vi.fn()
    vi.spyOn(notificationBar, "useNotificationBar").mockReturnValue({
      trigger: triggerMock,
    })

    addAchievementMock = vi.fn()
    vi.spyOn(entryStore, "useEntryStore").mockReturnValue({
      addAchievement: addAchievementMock,
    })
  })

  afterEach(() => {
    cleanup()
  })

  test("記録内容を書いて記録ボタンを押すと記録が追加される", async () => {
    render(EntryForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const testAchievement = {
      id: "achievement1",
      content: "achievement 1",
      entryType: "achievement",
      date: new Date("2025-04-01"),
    }
    addAchievementMock.mockReturnValue(testAchievement)

    const textarea = screen.getByLabelText(/記録する内容/i)
    await fireEvent.update(textarea, testAchievement.content)

    const achievementRadio = screen.getByRole("radio", { name: /よかったこと/i })
    await fireEvent.click(achievementRadio)

    const button = screen.getByRole("button", { name: /記録する/i })
    await fireEvent.click(button)

    expect(addAchievementMock).toHaveBeenCalledWith({
      content: testAchievement.content,
      entryType: testAchievement.entryType,
      date: expect.any(Date),
    })
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "success")
    expect(achievementRadio).toBeChecked()
    expect(textarea.value).toBe("")
  })

  test("記録内容を書いて Ctrl+Enter キーを押すと記録が追加される", async () => {
    render(EntryForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const testAchievement = {
      id: "achievement1",
      content: "achievement 1",
      entryType: "achievement",
      date: new Date("2025-04-01"),
    }
    addAchievementMock.mockReturnValue(testAchievement)

    const textarea = screen.getByLabelText(/記録する内容/i)
    await fireEvent.update(textarea, testAchievement.content)

    const achievementRadio = screen.getByRole("radio", { name: /よかったこと/i })
    await fireEvent.click(achievementRadio)

    await fireEvent.keyDown(textarea, {
      key: "Enter",
      code: "Enter",
      ctrlKey: true,
    })

    expect(addAchievementMock).toHaveBeenCalled({
      content: testAchievement.content,
      date: expect.any(Date),
      entryType: testAchievement.entryType,
    })
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "success")
    expect(achievementRadio).toBeChecked()
    expect(textarea.value).toBe("")
  })

  test("記録内容を書かずに記録ボタンを押した場合はエラー通知が表示される", async () => {
    render(EntryForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const button = screen.getByRole("button", { name: /記録する/i })
    await fireEvent.click(button)

    expect(addAchievementMock).not.toHaveBeenCalled()
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "error")
  })

  test("記録に失敗した場合はエラー通知が表示される", async () => {
    render(EntryForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const testAchievement = {
      id: "achievement1",
      content: "achievement 1",
      entryType: "achievement",
      date: new Date("2025-04-01"),
    }
    addAchievementMock.mockReturnValue(null)

    const textarea = screen.getByLabelText(/記録する内容/i)
    await fireEvent.update(textarea, testAchievement.content)

    const achievementRadio = screen.getByRole("radio", { name: /よかったこと/i })
    await fireEvent.click(achievementRadio)

    const button = screen.getByRole("button", { name: /記録する/i })
    await fireEvent.click(button)

    expect(addAchievementMock).toHaveBeenCalled({
      content: testAchievement.content,
      entryType: testAchievement.entryType,
      date: expect.any(Date),
    })
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "error")
    expect(achievementRadio).toBeChecked()
    expect(textarea.value).toBe(testAchievement.content)
  })

  test("記録の種類を選択して記録すると entryType に反映される", async () => {
    render(EntryForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const testAchievement = {
      id: "incomplete1",
      content: "incomplete 1",
      entryType: "incomplete",
      date: new Date("2025-04-01"),
    }
    addAchievementMock.mockReturnValue(testAchievement)

    const textarea = screen.getByLabelText(/記録する内容/i)
    await fireEvent.update(textarea, testAchievement.content)

    const achievementRadio = screen.getByRole("radio", { name: /よかったこと/i })
    const incompleteRadio = screen.getByRole("radio", { name: /ふりかえりたいこと/i })
    await fireEvent.click(incompleteRadio)

    const button = screen.getByRole("button", { name: /記録する/i })
    await fireEvent.click(button)

    expect(addAchievementMock).toHaveBeenCalledWith({
      content: testAchievement.content,
      entryType: testAchievement.entryType,
      date: expect.any(Date),
    })
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "success")
    expect(achievementRadio).toBeChecked()
    expect(textarea.value).toBe("")
  })
})
