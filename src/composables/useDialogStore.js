import { ref } from "vue"

const activeDialog = ref(null)
const dialogParams = ref({})
let resolver = null

export const useDialogStore = () => {
  return {
    activeDialog,
    dialogParams,
    open: (dialogName, params = {}) => {
      return new Promise((resolve) => {
        activeDialog.value = dialogName
        dialogParams.value = params
        resolver = resolve
      })
    },
    close: (result = null) => {
      if (resolver) {
        resolver(result)
        resolver = null
      }
      activeDialog.value = null
      dialogParams.value = {}
    },
  }
}
