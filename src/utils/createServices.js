import { EntryRepository } from "@/repositories/EntryRepository.js"
import { TagRepository } from "@/repositories/TagRepository.js"
import { TaggingRepository } from "@/repositories/TaggingRepository.js"

import { EntryService } from "@/services/EntryService.js"
import { TagService } from "@/services/TagService.js"
import { TaggingService } from "@/services/TaggingService.js"
import { ImportService } from "@/services/ImportService.js"
import { ExportService } from "@/services/ExportService.js"

export const createServices = (storage) => {
  const entryRepository = new EntryRepository(storage)
  const tagRepository = new TagRepository(storage)
  const taggingRepository = new TaggingRepository(storage)

  const entryService = new EntryService({ entryRepository, tagRepository, taggingRepository })
  const tagService = new TagService({ tagRepository })
  const taggingService = new TaggingService({ entryRepository, tagRepository, taggingRepository })
  const importService = new ImportService({ tagService, taggingService, entryService })
  const exportService = new ExportService({ tagService, taggingService, entryService })

  return { entryService, tagService, taggingService, importService, exportService }
}
