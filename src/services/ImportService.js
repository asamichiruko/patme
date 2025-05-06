import { isValidId } from "@/utils/idUtils"

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
    const { added, rejected } = this._mergeAchievements(validatedData)
    added.forEach((dat) => {
      this.entryService.addAchievement(dat)
    })
    return { added, rejected }
  }

  _validateAchievements(data) {
    const validated = []
    data.forEach((dat) => {
      const { id, content, date } = dat
      if (
        isValidId(id) &&
        content &&
        content !== "" &&
        new Date(date).toString() !== "Invalid Date"
      ) {
        validated.push({ id, content, date })
      }
    })
    return validated
  }

  _mergeAchievements(data) {
    // 既存のデータを優先し, id の重複する新規データは破棄する
    const added = []
    const rejected = []
    const existingIdSet = new Set(this.entryService.getAchievements().map((a) => a.id))

    data.forEach((dat) => {
      const { id, content, date } = dat
      if (existingIdSet.has(id)) {
        rejected.push({ id, content, date })
      } else {
        existingIdSet.add(id)
        added.push({ id, content, date })
      }
    })

    return { added, rejected }
  }

  _importStars(data) {
    const validatedData = this._validateStars(data)
    const { added, rejected } = this._mergeStars(validatedData)
    added.forEach((dat) => {
      this.entryService.addStar(dat)
    })
    return { added, rejected }
  }

  _validateStars(data) {
    const validated = []
    data.forEach((dat) => {
      const { id, achievementId, content, date } = dat
      if (
        isValidId(id) &&
        isValidId(achievementId) &&
        content &&
        content !== "" &&
        new Date(date).toString() !== "Invalid Date"
      ) {
        validated.push({ id, achievementId, content, date })
      }
    })
    return validated
  }

  _mergeStars(data) {
    // 既存のデータを優先し, id の重複する新規データは破棄する
    const added = []
    const rejected = []

    const existingAchievementIdSet = new Set(this.entryService.getAchievements().map((a) => a.id))
    const existingStarIdSet = new Set(this.entryService.getStars().map((a) => a.id))

    data.forEach((dat) => {
      const { id, achievementId, content, date } = dat
      if (existingStarIdSet.has(id) || !existingAchievementIdSet.has(achievementId)) {
        rejected.push({ id, achievementId, content, date })
      } else {
        existingStarIdSet.add(id)
        existingAchievementIdSet.add(achievementId)
        added.push({ id, achievementId, content, date })
      }
    })

    return { added, rejected }
  }

  _importTags(data) {
    const validatedData = this._validateTags(data)
    const { added, rejected } = this._mergeTags(validatedData)
    added.forEach((dat) => {
      this.tagService.addTag(dat)
    })
    return { added, rejected }
  }

  _validateTags(data) {
    const validated = []
    data.forEach((dat) => {
      const { id, title, order } = dat
      if (isValidId(id) && title && title !== "" && typeof order === "number" && order > 0) {
        validated.push({ id, title, order })
      }
    })
    return validated
  }

  _mergeTags(data) {
    // id, title が衝突する場合は既存を優先, order は上書きしない
    const added = []
    const rejected = []

    const existingTags = this.tagService.getTagsOrdered()
    const existingIdSet = new Set(existingTags.map((a) => a.id))
    const existingTitleSet = new Set(existingTags.map((a) => a.title))

    data.forEach((dat) => {
      const { id, title, order } = dat
      if (existingIdSet.has(id) || existingTitleSet.has(title)) {
        rejected.push({ id, title, order })
      } else {
        existingIdSet.add(id)
        existingTitleSet.add(title)
        added.push({ id, title, order })
      }
    })
    added.sort((a, b) => a.order - b.order)
    rejected.sort((a, b) => a.order - b.order)

    return { added, rejected }
  }

  _importTaggings(data) {
    const validatedData = this._validateTaggings(data)
    const { added, rejected } = this._mergeTaggings(validatedData)
    added.forEach((dat) => {
      this.taggingService.addTagging(dat)
    })
    return { added, rejected }
  }

  _validateTaggings(data) {
    const validated = []
    data.forEach((dat) => {
      const { achievementId, tagId } = dat
      if (isValidId(achievementId) && isValidId(tagId)) {
        validated.push({ achievementId, tagId })
      }
    })
    return validated
  }

  _mergeTaggings(data) {
    // 追加する tagging: 追加した achievement に紐づくもの (ふるい分け済み)
    // reject する tagging: どの tag にも紐づかないもの, 既存の achievement に紐づくもの
    const added = []
    const rejected = []

    const tagIdSet = new Set(this.tagService.getTagsOrdered().map((t) => t.id))
    data.forEach((dat) => {
      const { achievementId, tagId } = dat
      if (tagIdSet.has(tagId)) {
        this.taggingService.addTagging({ achievementId, tagId })
        added.push({ achievementId, tagId })
      } else {
        rejected.push({ achievementId, tagId })
      }
    })

    return { added, rejected }
  }
}
