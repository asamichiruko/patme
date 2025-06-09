import { ref } from "vue"

const isOpen = ref(false)
const params = ref({})
let resolver = null

export function useConfirmDialog() {
  const openConfirm = ({ message = "", title = "" } = {}) => {
    return new Promise((resolve) => {
      params.value = { message, title }
      isOpen.value = true
      resolver = resolve
    })
  }

  const closeConfirm = (result = null) => {
    if (resolver) {
      resolver(result)
    }
    isOpen.value = false
    params.value = {}
  }

  return {
    isOpen,
    params,
    openConfirm,
    closeConfirm,
  }
}
