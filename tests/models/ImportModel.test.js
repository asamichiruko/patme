vi.mock("@/utils/storageNotifier.js", () => ({ notify: vi.fn() }))

import { notify } from "@/utils/storageNotifier.js"
import { ImportModel } from "@/models/ImportModel.js"

describe("ImportModel.js", () => {
  let importModel
  let importService

  beforeEach(() => {
    vi.clearAllMocks()

    importService = {
      importData: vi.fn(),
    }
    importModel = new ImportModel(importService)
  })

  test("importFromFile で正常なデータがインポートされる", async () => {
    const data = {
      achievements: [],
      stars: [],
      tags: [],
      taggings: [],
    }
    const dataString = JSON.stringify(data)
    const mockFile = new File([dataString], "data.json", { type: "application/json" })
    mockFile.text = vi.fn().mockResolvedValue(dataString)

    await expect(importModel.importFromFile(mockFile)).resolves.not.toThrow()
    expect(notify).toHaveBeenCalled()
    expect(importService.importData).toHaveBeenCalledWith(data)
  })
})
