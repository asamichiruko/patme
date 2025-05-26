import TagCreateInlineForm from "@/components/tag/TagCreateInlineForm.vue"
import * as tagStore from "@/stores/useTagStore.js"
import { createTestingPinia } from "@pinia/testing"
import { cleanup, fireEvent, render, screen } from "@testing-library/vue"

describe("TagCreateInlineForm.vue", () => {
  let addTagMock
  let findByTitleMock

  beforeEach(() => {
    vi.clearAllMocks()

    addTagMock = vi.fn()
    findByTitleMock = vi.fn()
    vi.spyOn(tagStore, "useTagStore").mockReturnValue({
      addTag: addTagMock,
      findByTitle: findByTitleMock,
    })
  })

  afterEach(() => {
    cleanup()
  })

  test("新規タグ名を入力して追加ボタンを押すとタグが追加される", async () => {
    const { emitted } = render(TagCreateInlineForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const newTag = { id: "tag1", title: "newTag" }
    addTagMock.mockReturnValue(newTag)
    findByTitleMock.mockReturnValue(null)

    const tagTitleInput = screen.getByLabelText(/タグを追加/i)
    await fireEvent.update(tagTitleInput, newTag.title)

    const addButton = screen.getByRole("button", { name: /追加/i })
    await fireEvent.click(addButton)

    expect(addTagMock).toHaveBeenCalledWith(newTag.title)
    expect(findByTitleMock).not.toHaveBeenCalled()
    expect(emitted()).toHaveProperty("tag-created")
    expect(emitted()["tag-created"][0]).toEqual([newTag])
    expect(tagTitleInput.value).toBe("")
  })

  test("既存タグ名を入力して追加ボタンを押すと既存のタグが emit される", async () => {
    const { emitted } = render(TagCreateInlineForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const existingTag = { id: "tag1", title: "existingTag" }
    addTagMock.mockReturnValue(null)
    findByTitleMock.mockReturnValue(existingTag)

    const tagTitleInput = screen.getByLabelText(/タグを追加/i)
    await fireEvent.update(tagTitleInput, existingTag.title)

    const addButton = screen.getByRole("button", { name: /追加/i })
    await fireEvent.click(addButton)

    expect(addTagMock).toHaveBeenCalled()
    expect(findByTitleMock).toHaveBeenCalledWith(existingTag.title)
    expect(emitted()).toHaveProperty("tag-created")
    expect(emitted()["tag-created"][0]).toEqual([existingTag])
    expect(tagTitleInput.value).toBe("")
  })

  test("新規タグ名を入力してEnterキーを入力するとタグが追加される", async () => {
    const { emitted } = render(TagCreateInlineForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const newTag = { id: "tag1", title: "newTag" }
    addTagMock.mockReturnValue(newTag)
    findByTitleMock.mockReturnValue(null)

    const tagTitleInput = screen.getByLabelText(/タグを追加/i)
    await fireEvent.update(tagTitleInput, newTag.title)

    await fireEvent.keyDown(tagTitleInput, {
      key: "Enter",
      code: "Enter",
    })

    expect(addTagMock).toHaveBeenCalledWith(newTag.title)
    expect(findByTitleMock).not.toHaveBeenCalled()
    expect(emitted()).toHaveProperty("tag-created")
    expect(emitted()["tag-created"][0]).toEqual([newTag])
    expect(tagTitleInput.value).toBe("")
  })

  test("タグ名を入力せずに追加ボタンを押すと何も起こらない", async () => {
    const { emitted } = render(TagCreateInlineForm, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
          }),
        ],
      },
    })

    const addButton = screen.getByRole("button", { name: /追加/i })
    await fireEvent.click(addButton)

    expect(addTagMock).not.toHaveBeenCalled()
    expect(findByTitleMock).not.toHaveBeenCalled()
    expect(emitted()).not.toHaveProperty("tag-created")
  })
})
