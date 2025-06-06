import { ref } from "vue"

const isOpen = ref(false)
const params = ref({})
let resolver = null

export function usePromptDialog() {
  const openPrompt = ({ defaultValue = "" } = {}) => {
    return new Promise((resolve) => {
      params.value = { defaultValue }
      isOpen.value = true
      resolver = resolve
    })
  }

  const closePrompt = (result = null) => {
    if (resolver) {
      resolver(result)
    }
    isOpen.value = false
    params.value = {}
  }

  return {
    isOpen,
    params,
    openPrompt,
    closePrompt,
  }
}
