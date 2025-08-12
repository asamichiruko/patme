import { ref } from "vue"

const isOpen = ref(false)
const params = ref({})
let resolver = null

export function useAddCommentDialog() {
  const openAddComment = ({ defaultValue = "", entryType = null } = {}) => {
    return new Promise((resolve) => {
      params.value = { defaultValue, entryType }
      isOpen.value = true
      resolver = resolve
    })
  }

  const closeAddComment = (result = null) => {
    if (resolver) {
      resolver(result)
    }
    isOpen.value = false
    params.value = {}
  }

  return {
    isOpen,
    params,
    openAddComment,
    closeAddComment,
  }
}
