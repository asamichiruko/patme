import { cleanup, fireEvent, render, screen } from "@testing-library/vue"
import EntryListItem from "@/components/entry/EntryListItem.vue"
import * as taggingDialog from "@/composables/useTaggingDialog.js"
import * as promptDialog from "@/composables/usePromptDialog.js"
import * as notificationBar from "@/composables/useNotificationBar.js"
import * as entryStore from "@/stores/useEntryStore.js"
import * as taggingStore from "@/stores/useTaggingStore.js"
import { createTestingPinia } from "@pinia/testing"

describe("EntryListItem.vue", () => {
  let openTaggingDialogMock
  let openPromptMock
  let triggerMock
  let addStarMock
  let updateTaggingsMock
  const testEntry = {
    id: "achievement1",
    content: "achievement 1",
    entryType: "achievement",
    reviewedCount: 0,
    date: new Date("2025-04-01"),
    stars: [],
    tags: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()

    openTaggingDialogMock = vi.fn()
    vi.spyOn(taggingDialog, "useTaggingDialog").mockReturnValue({
      openTaggingDialog: openTaggingDialogMock,
    })

    openPromptMock = vi.fn()
    vi.spyOn(promptDialog, "usePromptDialog").mockReturnValue({
      openPrompt: openPromptMock,
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
      reviewType: null,
      date: new Date("2025-04-01"),
    }

    openPromptMock.mockResolvedValue({ content: testStar.content, reviewType: null })
    addStarMock.mockReturnValue(testStar)

    const commentButton = screen.getByRole("button", { name: /コメント/i })
    await fireEvent.click(commentButton)

    expect(openPromptMock).toHaveBeenCalledWith({
      defaultValue: "",
      entryType: "achievement",
    })
    expect(addStarMock).toHaveBeenCalledWith({
      achievementId: testStar.achievementId,
      content: testStar.content,
      reviewType: null,
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

    openPromptMock.mockResolvedValue(null)

    const commentButton = screen.getByRole("button", { name: /コメント/i })
    await fireEvent.click(commentButton)

    expect(openPromptMock).toHaveBeenCalled()
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
    openTaggingDialogMock.mockResolvedValue(testTagIds)

    const taggingButton = screen.getByRole("button", { name: /タグ/i })
    await fireEvent.click(taggingButton)

    expect(openTaggingDialogMock).toHaveBeenCalledWith({
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

    openTaggingDialogMock.mockResolvedValue(null)

    const taggingButton = screen.getByRole("button", { name: /タグ/i })
    await fireEvent.click(taggingButton)

    expect(openTaggingDialogMock).toHaveBeenCalled()
    expect(updateTaggingsMock).not.toHaveBeenCalled()
  })
})
