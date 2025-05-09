import { isValidAchievement, isValidStar, isValidTag, isValidTagging } from "@/utils/validator.js"

export class ImportService {
  constructor({ tagService, taggingService, entryService }) {
    this.tagService = tagService
    this.taggingService = taggingService
    this.entryService = entryService
  }

  importData(data) {
    const { achievements = [], stars = [], tags = [], taggings = [] } = data

    if (
      !Array.isArray(achievements) ||
      !Array.isArray(stars) ||
      !Array.isArray(tags) ||
      !Array.isArray(taggings)
    ) {
      throw new TypeError("Invalid import format: Each field must be an array.")
    }

    const result = {}

    result.achievements = this._importAchievements(achievements)
    result.stars = this._importStars(stars)
    result.tags = this._importTags(tags)

    // 新規追加した achievement 以外に紐づく taggings は reject する
    const prerejectedTaggings = []
    const achievementIdSet = new Set(result.achievements.added.map((a) => a.id))
    const prefilteredTaggings = taggings.filter((t) => {
      if (achievementIdSet.has(t.achievementId)) {
        return true
      }
      prerejectedTaggings.push(t)
      return false
    })

    result.taggings = this._importTaggings(prefilteredTaggings)
    prerejectedTaggings.forEach((t) => {
      result.taggings.rejected.push(t)
    })

    return result
  }

  _importAchievements(data) {
    const validatedData = this._validateAchievements(data)
    const { toAdd, toReject } = this._mergeAchievements(validatedData)
    const added = []
    toAdd.forEach((dat) => {
      added.push(this.entryService.addAchievement(dat))
    })
    return { added, rejected: toReject }
  }

  _validateAchievements(data) {
    const validated = []
    data.forEach((dat) => {
      const { id, content, date } = dat
      if (isValidAchievement({ id, content, date })) {
        validated.push({ id, content, date })
      }
    })
    return validated
  }

  _mergeAchievements(data) {
    const toAdd = []
    const toReject = []
    const existingIdSet = new Set(this.entryService.getAchievements().map((a) => a.id))

    data.forEach((dat) => {
      const { id, content, date } = dat
      if (existingIdSet.has(id)) {
        toReject.push({ id, content, date })
      } else {
        existingIdSet.add(id)
        toAdd.push({ id, content, date })
      }
    })

    return { toAdd, toReject }
  }

  _importStars(data) {
    const validatedData = this._validateStars(data)
    const { toAdd, toReject } = this._mergeStars(validatedData)
    const added = []
    toAdd.forEach((dat) => {
      added.push(this.entryService.addStar(dat))
    })
    return { added, rejected: toReject }
  }

  _validateStars(data) {
    const validated = []
    data.forEach((dat) => {
      const { id, achievementId, content, date } = dat
      if (isValidStar({ id, achievementId, content, date })) {
        validated.push({ id, achievementId, content, date })
      }
    })
    return validated
  }

  _mergeStars(data) {
    const toAdd = []
    const toReject = []

    const existingAchievementIdSet = new Set(this.entryService.getAchievements().map((a) => a.id))
    const existingStarIdSet = new Set(this.entryService.getStars().map((a) => a.id))

    data.forEach((dat) => {
      const { id, achievementId, content, date } = dat
      if (existingStarIdSet.has(id) || !existingAchievementIdSet.has(achievementId)) {
        toReject.push({ id, achievementId, content, date })
      } else {
        existingStarIdSet.add(id)
        existingAchievementIdSet.add(achievementId)
        toAdd.push({ id, achievementId, content, date })
      }
    })

    return { toAdd, toReject }
  }

  _importTags(data) {
    const validatedData = this._validateTags(data)
    const { toAdd, toReject } = this._mergeTags(validatedData)
    const added = []
    toAdd.forEach((dat) => {
      added.push(this.tagService.addTag(dat))
    })
    return { added, rejected: toReject }
  }

  _validateTags(data) {
    const validated = []
    data.forEach((dat) => {
      const { id, title, order } = dat
      if (isValidTag({ id, title, order })) {
        validated.push({ id, title, order })
      }
    })
    return validated
  }

  _mergeTags(data) {
    const toAdd = []
    const toReject = []

    const existingTags = this.tagService.getTagsOrdered()
    const existingIdSet = new Set(existingTags.map((a) => a.id))
    const existingTitleSet = new Set(existingTags.map((a) => a.title))

    data.forEach((dat) => {
      const { id, title, order } = dat
      if (existingIdSet.has(id) || existingTitleSet.has(title)) {
        toReject.push({ id, title, order })
      } else {
        existingIdSet.add(id)
        existingTitleSet.add(title)
        toAdd.push({ id, title, order })
      }
    })
    toAdd.sort((a, b) => a.order - b.order)
    toReject.sort((a, b) => a.order - b.order)

    return { toAdd, toReject }
  }

  _importTaggings(data) {
    const validatedData = this._validateTaggings(data)
    const { toAdd, toReject } = this._mergeTaggings(validatedData)
    const added = []
    toAdd.forEach((dat) => {
      added.push(this.taggingService.addTagging(dat))
    })
    return { added, rejected: toReject }
  }

  _validateTaggings(data) {
    const validated = []
    data.forEach((dat) => {
      const { achievementId, tagId } = dat
      if (isValidTagging({ achievementId, tagId })) {
        validated.push({ achievementId, tagId })
      }
    })
    return validated
  }

  _mergeTaggings(data) {
    const toAdd = []
    const toReject = []

    const tagIdSet = new Set(this.tagService.getTagsOrdered().map((t) => t.id))
    data.forEach((dat) => {
      const { achievementId, tagId } = dat
      if (tagIdSet.has(tagId)) {
        this.taggingService.addTagging({ achievementId, tagId })
        toAdd.push({ achievementId, tagId })
      } else {
        toReject.push({ achievementId, tagId })
      }
    })

    return { toAdd, toReject }
  }
}
