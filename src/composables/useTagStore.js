import { ref } from "vue"

export const useTagStore = (tagModel) => {
  const allTags = ref(tagModel.getTagsOrdered())
  return {
    allTags,
    addTag: (title) => {
      const result = tagModel.addTag({ title })
      allTags.value = tagModel.getTagsOrdered()
      return result
    },
    findByTitle: (title) => {
      const result = tagModel.findByTitle({ title })
      return result
    },
  }
}
