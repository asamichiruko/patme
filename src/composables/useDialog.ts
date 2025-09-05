import { ref, type Ref } from "vue"

export function useDialog<T>() {
  const visible = ref(false)
  const params: Ref<T | null> = ref(null)

  const openDialog = (p: T) => {
    params.value = p
    visible.value = true
  }

  const closeDialog = () => {
    visible.value = false
    params.value = null
  }

  return {
    visible,
    params,
    openDialog,
    closeDialog,
  }
}
