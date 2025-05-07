export class ExportService {
  constructor({ entryService, taggingService, tagService }) {
    this.entryService = entryService
    this.taggingService = taggingService
    this.tagService = tagService
  }

  exportData() {
    const achievements = this.entryService.getAchievements()
    const stars = this.entryService.getStars()
    const tags = this.tagService.getTagsOrdered()
    const taggings = this.taggingService.getTaggings()
    const exportObject = { achievements, stars, tags, taggings }

    return exportObject
  }
}
