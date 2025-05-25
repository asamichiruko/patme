import { reactive } from "vue"

const notification = reactive({
  show: false,
  message: "",
  type: "info",
})

let timeoutId

export function useNotificationBar() {
  const trigger = (msg, type = "info", duration = 3000) => {
    notification.message = msg
    notification.type = type
    notification.show = true

    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      notification.show = false
    }, duration)
  }

  return {
    notification,
    trigger,
  }
}
