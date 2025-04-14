import { render, screen, fireEvent, cleanup } from "@testing-library/vue"

const trigger = vi.hoisted(() => vi.fn())

vi.mock("@/composables/useNotification.js", () => {
  return {
    useNotification: () => ({
      trigger: trigger,
    }),
  }
})

import SettingsForm from "@/components/SettingsForm.vue"

describe("SettingsForm.vue", () => {
  const validJson = {
    achievements: [
      {
        id: "c2e0439a-7cd0-4743-a9ef-b299699f09a6",
        content: "テスト記録1",
        date: new Date("2025-04-01 15:00:00"),
      },
      {
        id: "8adcf1ba-89d8-475f-b651-b14df49853eb",
        content: "テスト記録2",
        date: new Date("2025-04-01 16:00:00"),
      },
    ],
    stars: [
      {
        id: "13ac6ed5-e94e-4a56-8967-cc53d9c26eea",
        achievementId: "8adcf1ba-89d8-475f-b651-b14df49853eb",
        content: "スター1 (テスト記録2)",
        date: new Date("2025-04-01 16:30"),
      },
    ],
  }
  const validJsonString = JSON.stringify(validJson)

  let mockRecordModel
  let mockFile

  beforeEach(() => {
    mockFile = new File([JSON.stringify(validJsonString)], "data.json", {
      type: "application/json",
    })
    mockFile.text = vi.fn().mockResolvedValue(validJsonString)

    mockRecordModel = {
      exportAsJson: vi.fn(),
      importFromJson: vi.fn(),
    }
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  test("ファイルを選択すると recordModel.importRecords が呼ばれる", async () => {
    render(SettingsForm, {
      props: {
        recordModel: mockRecordModel,
      },
    })

    const fileInput = screen.getByTestId("import-file")

    Object.defineProperty(fileInput, "files", {
      value: [mockFile],
      writable: true,
    })

    await fireEvent.update(fileInput, {
      target: { files: [mockFile] },
    })

    expect(mockRecordModel.importFromJson).toHaveBeenCalled()
  })
})
