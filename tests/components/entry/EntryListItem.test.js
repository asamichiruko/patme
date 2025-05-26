import { cleanup, fireEvent, render, screen } from "@testing-library/vue"
import EntryListItem from "@/components/entry/EntryListItem.vue"
import * as dialogStore from "@/composables/useDialogStore.js"
import * as notificationBar from "@/composables/useNotificationBar.js"
import * as entryStore from "@/stores/useEntryStore.js"
import * as taggingStore from "@/stores/useTaggingStore.js"
import { createTestingPinia } from "@pinia/testing"

describe("EntryListItem.vue", () => {
  let openMock
  let triggerMock
  let addStarMock
  let updateTaggingsMock
  const testEntry = {
    id: "achievement1",
    content: "achievement 1",
    date: new Date("2025-04-01"),
    stars: [],
    tags: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()

    openMock = vi.fn()
    vi.spyOn(dialogStore, "useDialogStore").mockReturnValue({
      open: openMock,
    })

    triggerMock = vi.fn()
    vi.spyOn(notificationBar, "useNotificationBar").mockReturnValue({
      trigger: triggerMock,
    })

    addStarMock = vi.fn()
    vi.spyOn(entryStore, "useEntryStore").mockReturnValue({
      addStar: addStarMock,
    })

    updateTaggingsMock = vi.fn()
    vi.spyOn(taggingStore, "useTaggingStore").mockReturnValue({
      updateTaggings: updateTaggingsMock,
    })
  })

  afterEach(() => {
    cleanup()
  })

  test("コメントダイアログを通して正常にコメントが記録される", async () => {
    render(EntryListItem, {
      props: {
        entry: testEntry,
      },
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const testStar = {
      achievementId: testEntry.id,
      content: "star 1",
    }

    openMock.mockResolvedValue(testStar.content)
    addStarMock.mockReturnValue(testStar)

    const commentButton = screen.getByRole("button", { name: /コメント/i })
    await fireEvent.click(commentButton)

    expect(openMock).toHaveBeenCalledWith("prompt", {
      message: expect.any(String),
      placeholder: expect.any(String),
      submittext: expect.any(String),
      canceltext: expect.any(String),
    })
    expect(addStarMock).toHaveBeenCalledWith({
      achievementId: testStar.achievementId,
      content: testStar.content,
      date: expect.any(Date),
    })
    expect(triggerMock).toHaveBeenCalledWith(expect.any(String), "success")
  })

  test("コメントがキャンセルされた場合はコメントが記録されない", async () => {
    render(EntryListItem, {
      props: {
        entry: testEntry,
      },
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    openMock.mockResolvedValue(null)

    const commentButton = screen.getByRole("button", { name: /コメント/i })
    await fireEvent.click(commentButton)

    expect(openMock).toHaveBeenCalled()
    expect(addStarMock).not.toHaveBeenCalled()
    expect(triggerMock).not.toHaveBeenCalled()
  })

  test("タグ付けダイアログを通して正常にタグ付けが行われる", async () => {
    render(EntryListItem, {
      props: {
        entry: testEntry,
      },
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const testTagIds = ["tag1", "tag2"]
    openMock.mockResolvedValue(testTagIds)

    const taggingButton = screen.getByRole("button", { name: /タグ/i })
    await fireEvent.click(taggingButton)

    expect(openMock).toHaveBeenCalledWith("tagging", {
      initialTagIds: [],
    })
    expect(updateTaggingsMock).toHaveBeenCalledWith({
      achievementId: testEntry.id,
      tagIds: testTagIds,
    })
  })

  test("タグ付けがキャンセルされた場合はタグ付けされない", async () => {
    render(EntryListItem, {
      props: {
        entry: testEntry,
      },
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    openMock.mockResolvedValue(null)

    const taggingButton = screen.getByRole("button", { name: /タグ/i })
    await fireEvent.click(taggingButton)

    expect(openMock).toHaveBeenCalled()
    expect(updateTaggingsMock).not.toHaveBeenCalled()
  })
})
