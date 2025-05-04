import { generateId } from "@/utils/idUtils.js"
import {
  isValidAchievement,
  isValidStar,
  isValidTag,
  isValidTagging,
} from "@/utils/entryValidator.js"
import { notify } from "@/utils/storageNotifier.js"
import { TagModel } from "@/models/TagModel.js"
import { TaggingModel } from "@/models/TaggingModel.js"

export class EntryModel {
  constructor(storage) {
    this.storage = storage
    this.tagModel = new TagModel(storage)
    this.taggingModel = new TaggingModel(storage)
  }

  addAchievement({ content }) {
    const id = generateId()
    const date = new Date()
    const achievement = { id, content, date }

    if (!isValidAchievement(achievement)) {
      return false
    }

    this.storage.addAchievement({ id, content, date })
    notify()
    return true
  }

  addStar({ achievementId, content }) {
    const id = generateId()
    const date = new Date()
    const star = { id, achievementId, content, date }

    if (!isValidAchievement(star)) {
      return false
    }

    this.storage.addStar(star)
    notify()
    return true
  }

  getEntries() {
    const achievements = this.storage.getAchievements()
    const stars = this.storage.getStars()
    const tags = this.tagModel.getAllTags()
    const taggings = this.storage.getTaggings()

    const groupedStars = Map.groupBy(stars, (star) => star.achievementId)
    const groupedTags = Map.groupBy(
      this.taggingModel.resolveTagTitles({ taggings, tags }),
      (t) => t.achievementId,
    )

    const entries = achievements.map((a) => ({
      achievement: a,
      stars: groupedStars.get(a.id) || [],
      tags: groupedTags.get(a.id) || [],
    }))
    entries.sort((a, b) => b.achievement.date - a.achievement.date)
    for (const entry of entries) {
      entry.tags.sort((a, b) => a.order - b.order)
    }

    return entries
  }

  exportAsJson() {
    const achievements = this.storage.getAchievements()
    const stars = this.storage.getStars()
    const tags = this.tagModel.getAllTags()
    const taggings = this.storage.getTaggings()
    const exportObject = { achievements, stars, tags, taggings }
    return exportObject
  }

  importFromJson(json) {
    // json データ形式の確認
    if (![json.achievements, json.stars, json.tags, json.taggings].every(Array.isArray)) {
      throw new SyntaxError("Invalid data format")
    }

    this.importAchievements(json.achievements)
    this.importStars(json.stars)
    this.importTags(json.tags)
    this.importTaggings(json.taggings)

    notify()
  }

  importAchievements(data) {
    const filteredAchievements = this.filterAchievements(data)
    const existingAchievements = this.storage.getAchievements()
    const { merged: mergedAchievements } = this.mergeAchievements(
      existingAchievements,
      filteredAchievements,
    )
    this.storage.replaceAchievements(mergedAchievements)
  }

  filterAchievements(data) {
    return data
      .map((a) => ({ id: a.id, content: a.content, date: a.date }))
      .filter((a) => isValidAchievement(a))
  }

  mergeAchievements(existingData, newerData) {
    const newerMap = new Map(newerData.map((a) => [a.id, a]))

    const merged = [...existingData]
    const rejected = []
    const existingIds = new Set(existingData.map((a) => a.id))

    newerMap.forEach((dat, id) => {
      if (existingIds.has(id)) {
        rejected.push(dat)
      } else {
        merged.push(dat)
        existingIds.add(id)
      }
    })
    merged.sort((a, b) => a.date - b.date)

    return {
      merged: merged,
      rejected: rejected,
    }
  }

  importStars(data) {
    const filteredStars = this.filterStars(data)
    const existingStars = this.storage.getStars()
    const { merged: mergedStars } = this.mergeStars(existingStars, filteredStars)
    this.storage.replaceStars(mergedStars)
  }

  filterStars(data) {
    const existingAchievementIds = new Set(this.storage.getAchievements().map((a) => a.id))
    return data
      .map((a) => ({ id: a.id, achievementId: a.achievementId, content: a.content, date: a.date }))
      .filter((a) => isValidStar(a) && existingAchievementIds.has(a.achievementId))
  }

  mergeStars(existingData, newerData) {
    const newerMap = new Map(newerData.map((a) => [a.id, a]))

    const merged = [...existingData]
    const rejected = []
    const existingIds = new Set(existingData.map((a) => a.id))

    newerMap.forEach((dat, id) => {
      if (existingIds.has(id)) {
        rejected.push(dat)
      } else {
        existingIds.add(dat.id)
        merged.push(dat)
      }
    })
    merged.sort((a, b) => a.date - b.date)

    return {
      merged: merged,
      rejected: rejected,
    }
  }

  importTags(data) {
    const filteredTags = this.filterTags(data)
    const existingTags = this.storage.getTags()
    const { merged: mergedTags } = this.mergeTags(existingTags, filteredTags)
    this.storage.replaceTags(mergedTags)
  }

  filterTags(data) {
    return data
      .map((a) => ({ id: a.id, title: a.title, order: a.order }))
      .filter((a) => isValidTag(a))
  }

  mergeTags(existingData, newerData) {
    const ordered = []

    // まず order を一意に振る
    let maxOrder = Math.max(0, ...existingData.map((a) => a.order || 0))

    for (const dat of existingData) {
      if (!dat.order) {
        maxOrder += 1
        dat.order = maxOrder
      }
      ordered.push(dat)
    }
    for (const dat of newerData) {
      maxOrder += 1
      dat.order = maxOrder
      ordered.push(dat)
    }

    ordered.sort((a, b) => a.order - b.order)

    const merged = []
    const rejected = []

    // id または title が重複するものを除去する
    const existingId = new Set()
    const existingTitle = new Set()

    for (const dat of ordered) {
      if (existingId.has(dat.id) || existingTitle.has(dat.title)) {
        rejected.push(dat)
      } else {
        existingId.add(dat.id)
        existingTitle.add(dat.title)
        merged.push(dat)
      }
    }

    return {
      merged: merged,
      rejected: rejected,
    }
  }

  importTaggings(data) {
    const filteredTaggings = this.filterTaggings(data)
    const existingTaggings = this.storage.getTaggings()
    const { merged: mergedTaggings } = this.mergeTaggings(existingTaggings, filteredTaggings)
    this.storage.replaceTaggings(mergedTaggings)
  }

  filterTaggings(data) {
    const existingAchievementIds = new Set(this.storage.getAchievements().map((a) => a.id))
    const existingTagIds = new Set(this.storage.getTags().map((a) => a.id))
    return data
      .map((a) => ({ achievementId: a.achievementId, tagId: a.tagId }))
      .filter(
        (a) =>
          isValidTagging(a) &&
          existingAchievementIds.has(a.achievementId) &&
          existingTagIds.has(a.tagId),
      )
  }

  mergeTaggings(existingData, newerData) {
    const existingIds = new Set(
      existingData.map((a) =>
        this.taggingModel.generateTaggingId({ achievementId: a.achievementId, tagId: a.tagId }),
      ),
    )
    const merged = [...existingData]
    const rejected = []

    for (const dat of newerData) {
      const newTaggingId = this.taggingModel.generateTaggingId({
        achievementId: dat.achievementId,
        tagId: dat.tagId,
      })

      if (existingIds.has(newTaggingId)) {
        rejected.push(this.taggingModel.parseTaggingId(newTaggingId))
      } else {
        existingIds.add(newTaggingId)
        merged.push(this.taggingModel.parseTaggingId(newTaggingId))
      }
    }

    return { merged: merged, rejected: rejected }
  }
}
