import { ExportModel } from "@/models/ExportModel.js"

describe("ExportModel.js", () => {
  let exportModel
  let exportService

  beforeEach(() => {
    vi.clearAllMocks()

    exportService = {
      exportData: vi.fn(),
    }
    exportModel = new ExportModel(exportService)
  })

  test("exportToFile で正常にデータがエクスポートされる", async () => {
    const data = {
      achievements: [],
      stars: [],
      tags: [],
      taggings: [],
    }

    exportService.exportData.mockReturnValue(data)
    const file = exportModel.exportToFile()

    expect(exportService.exportData).toHaveBeenCalled()
    expect(file.type).toBe("application/json")
    expect(file.size).toBe(JSON.stringify(data).length)
  })
})
