import { ref } from "vue"

const isOpen = ref(false)
const params = ref({})
let resolver = null

export function useTaggingDialog() {
  const openTaggingDialog = ({ initialTagIds = [] } = {}) => {
    return new Promise((resolve) => {
      params.value = { initialTagIds }
      isOpen.value = true
      resolver = resolve
    })
  }

  const closeTaggingDialog = (result = null) => {
    if (resolver) {
      resolver(result)
    }
    isOpen.value = false
    params.value = {}
  }

  return {
    isOpen,
    params,
    openTaggingDialog,
    closeTaggingDialog,
  }
}
