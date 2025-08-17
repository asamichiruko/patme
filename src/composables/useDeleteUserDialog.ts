import { ref } from "vue"

const visible = ref(false)

export function useDeleteUserDialog() {
  const openDeleteUserDialog = () => {
    visible.value = true
  }

  const closeDeleteUserDialog = () => {
    visible.value = false
  }

  return {
    visible,
    openDeleteUserDialog,
    closeDeleteUserDialog,
  }
}
