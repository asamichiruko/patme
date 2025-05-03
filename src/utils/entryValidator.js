import { isValidId } from "@/utils/idUtils.js"

export function isValidAchievement({ id, content, date }) {
  let isValid = true
  isValid = isValid && isValidId(id)
  isValid = isValid && content && content !== ""
  isValid = isValid && new Date(date).toString() !== "Invalid Date"

  return isValid
}

export function isValidStar({ id, achievementId, content, date }) {
  let isValid = true
  isValid = isValid && isValidId(id)
  isValid = isValid && isValidId(achievementId)
  isValid = isValid && content && content !== ""
  isValid = isValid && new Date(date).toString() !== "Invalid Date"

  return isValid
}

export function isValidTag({ id, title }) {
  let isValid = true
  isValid = isValid && isValidId(id)
  isValid = isValid && title && title !== ""

  return isValid
}

export function isValidTagging({ achievementId, tagId }) {
  let isValid = true
  isValid = isValid && isValidId(achievementId)
  isValid = isValid && isValidId(tagId)

  return isValid
}
