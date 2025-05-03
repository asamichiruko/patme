export function generateId() {
  return crypto.randomUUID()
}

export function isValidId(id) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return id && uuidRegex.test(id)
}

export function generateTaggingId(tagging) {
  return [tagging.achievementId, tagging.tagId].join(",")
}

export function parseTaggingId(taggingId) {
  const [achievementId, tagId] = taggingId.split(",")
  return { achievementId, tagId }
}
