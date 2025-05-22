export const useEntryStore = (entryModel) => {
  return {
    addAchievement: ({ content, date }) => {
      return entryModel.addAchievement({ content, date })
    },
    addStar: ({ achievementId, content, date }) => {
      return entryModel.addStar({ achievementId, content, date })
    },
    getEntriesWithTags: ({ sortFn }) => {
      return entryModel.getEntriesWithTags({ sortFn })
    },
  }
}
