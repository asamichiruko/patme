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

  test("達成内容を書いて記録ボタンを押すと達成事項が追加される", async () => {
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
      date: new Date("2025-04-01"),
    }
    addAchievementMock.mockReturnValue(testAchievement)

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, testAchievement.content)

    const button = screen.getByRole("button", { name: /記録する/i })
    await fireEvent.click(button)

    expect(addAchievementMock).toHaveBeenCalledWith({
      content: testAchievement.content,
      date: expect.any(Date),
    })
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "success")
    expect(textarea.value).toBe("")
  })

  test("達成内容を書いて Ctrl+Enter キーを押すと達成事項が追加される", async () => {
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
      date: new Date("2025-04-01"),
    }
    addAchievementMock.mockReturnValue(testAchievement)

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, testAchievement.content)

    await fireEvent.keyDown(textarea, {
      key: "Enter",
      code: "Enter",
      ctrlKey: true,
    })

    expect(addAchievementMock).toHaveBeenCalled({
      content: testAchievement.content,
      date: expect.any(Date),
    })
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "success")
    expect(textarea.value).toBe("")
  })

  test("達成内容を書かずに記録ボタンを押した場合はエラー通知が表示される", async () => {
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
      date: new Date("2025-04-01"),
    }
    addAchievementMock.mockReturnValue(null)

    const textarea = screen.getByLabelText("達成内容")
    await fireEvent.update(textarea, testAchievement.content)

    const button = screen.getByRole("button", { name: /記録する/i })
    await fireEvent.click(button)

    expect(addAchievementMock).toHaveBeenCalled({
      content: testAchievement.content,
      date: expect.any(Date),
    })
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "error")
    expect(textarea.value).toBe(testAchievement.content)
  })
})
