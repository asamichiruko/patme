import { setActivePinia, createPinia } from "pinia"
import { useDataTransferStore } from "@/stores/useDataTransferStore.js"
import * as storageNotifier from "@/utils/storageNotifier.js"

describe("useDataTransferStore.js", () => {
  let mockImportService
  let mockExportService
  let dataTransferStore
  let notifySpy

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    mockImportService = {
      importData: vi.fn(),
    }
    mockExportService = {
      exportData: vi.fn(),
    }
    dataTransferStore = useDataTransferStore()
    dataTransferStore.setService({
      importService: mockImportService,
      exportService: mockExportService,
    })

    notifySpy = vi.spyOn(storageNotifier, "notify")
  })

  test("setService が正しく呼び出されていない場合に例外が送られる", async () => {
    dataTransferStore.setService({ importService: null, exportService: null })
    const mockFile = new File([`{"key":"value"}`], "data.json", { type: "application/json" })
    mockFile.text = vi.fn().mockResolvedValue(`{"key":"value"}`)

    await expect(() => dataTransferStore.importFromFile(mockFile)).rejects.toThrow(/ImportService/i)
    expect(() => dataTransferStore.exportToFile()).toThrow(/ExportService/i)
  })

  test("データが正常にインポートされる", async () => {
    const mockFile = new File([`{"key":"value"}`], "data.json", { type: "application/json" })
    mockFile.text = vi.fn().mockResolvedValue(`{"key":"value"}`)

    await dataTransferStore.importFromFile(mockFile)
    expect(mockImportService.importData).toHaveBeenCalledWith({ key: "value" })
    expect(notifySpy).toHaveBeenCalled()
  })

  test("データファイルを開けなかった場合に例外が送られる", async () => {
    const mockFile = new File(["{}"], "data.json", { type: "application/json" })
    mockFile.text = vi.fn().mockRejectedValue(new Error("text() rejected"))

    await expect(dataTransferStore.importFromFile(mockFile)).rejects.toThrow()
    expect(notifySpy).not.toHaveBeenCalled()
  })

  test("データが正常にエクスポートされる", () => {
    mockExportService.exportData.mockReturnValue({ key: "value" })
    const result = dataTransferStore.exportToFile()
    expect(result).toBeInstanceOf(Blob)
    expect(result.type).toBe("application/json")
  })
})
