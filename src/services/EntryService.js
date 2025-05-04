import { generateId } from "@/utils/idUtils.js"

export class EntryService {
  constructor(entryRepository) {
    this.entryRepos = entryRepository
  }

  addEntry({ content, date, stars }) {
    const achievement = {
      id: generateId(),
      content,
      date,
      stars: stars.map((s) => ({
        id: generateId(),
        content: s.content,
        date: s.date,
      })),
    }

    this.entryRepos.add(achievement)
    return achievement
  }

  getEntriesSortedByDateDesc() {
    const entries = this.entryRepos.getAll()
    entries.sort((a, b) => b.date - a.date)
    return entries
  }

  getEntriesSortedbyLatestStarDate() {}
}
