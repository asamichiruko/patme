import type { EntryType } from "@/types"

export function parseDate(dateObj: unknown): Date {
  if (dateObj instanceof Date) {
    return isNaN(dateObj.getTime()) ? new Date() : dateObj
  }
  if (typeof dateObj === "string" || typeof dateObj === "number") {
    const date = new Date(dateObj)
    return isNaN(date.getTime()) ? new Date() : date
  }
  return new Date()
}

export function parseEntryType(entryType: unknown): EntryType {
  const entryTypeString = entryType ? entryType.toString() : ""
  const validTypes = ["achievement", "incomplete", "accepted"]
  return validTypes.includes(entryTypeString) ? (entryTypeString as EntryType) : "achievement"
}
