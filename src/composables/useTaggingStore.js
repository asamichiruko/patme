export const useTaggingStore = (taggingModel) => {
  return {
    updateTaggings: ({ achievementId, tagIds }) => {
      taggingModel.updateTaggings({ achievementId, tagIds })
    },
  }
}
