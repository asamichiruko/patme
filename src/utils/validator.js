import { isValidId } from "@/utils/idUtils.js"

export function isValidAchievement({ id, content, date, isReviewed, entryType }) {
  return (
    isValidId(id) &&
    typeof content === "string" &&
    content.trim() !== "" &&
    new Date(date).toString() !== "Invalid Date" &&
    typeof isReviewed === "boolean" &&
    ["achievement", "incomplete", "accepted"].includes(entryType ?? "achievement")
  )
}

export function isValidStar({ id, achievementId, content, reviewedType, date }) {
  return (
    isValidId(id) &&
    isValidId(achievementId) &&
    typeof content === "string" &&
    content.trim() !== "" &&
    ["achievement", "incomplete", "accepted", null].includes(reviewedType) &&
    new Date(date).toString() !== "Invalid Date"
  )
}

export function isValidTag({ id, title, order }) {
  return (
    isValidId(id) &&
    typeof title === "string" &&
    title.trim() !== "" &&
    typeof order === "number" &&
    order > 0
  )
}

export function isValidTagging({ achievementId, tagId }) {
  return isValidId(achievementId) && isValidId(tagId)
}
