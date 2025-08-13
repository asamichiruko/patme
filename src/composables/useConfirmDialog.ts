import { ref } from "vue"

type Resolver = ((result: boolean) => void) | null

const isOpen = ref(false)
const confirmTitle = ref("")
const confirmMessage = ref("")
const resolver = ref<Resolver>(null)

export function useConfirmDialog() {
  const openConfirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmTitle.value = title
      confirmMessage.value = message
      resolver.value = resolve as Resolver
      isOpen.value = true
    })
  }

  const closeConfirm = (result: boolean) => {
    if (resolver.value) {
      resolver.value(result)
    }
    isOpen.value = false
    confirmTitle.value = ""
    confirmMessage.value = ""
    resolver.value = null
  }

  return {
    isOpen,
    confirmTitle,
    confirmMessage,
    openConfirm,
    closeConfirm,
  }
}
