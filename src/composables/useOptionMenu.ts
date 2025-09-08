import { ref } from "vue"

export type Option = { value: string; label: string }
export type Position = { x: number; y: number }
export type OptionHandler = (option: Option, params: Record<string, unknown>) => void

const isVisible = ref(false)
const options = ref<Option[]>([])
const position = ref({ x: 0, y: 0 })
const handler = ref<OptionHandler | null>(null)
const params = ref<Record<string, unknown>>({})
const triggerElement = ref<HTMLElement | null>(null)

const showMenu = (
  menuOptions: Option[],
  menuPosition: Position,
  optionHandler: OptionHandler,
  menuParams: Record<string, unknown>,
  trigger?: HTMLElement | null,
) => {
  if (isVisible.value) {
    isVisible.value = false
  }

  options.value = menuOptions
  position.value = menuPosition
  handler.value = optionHandler
  params.value = menuParams
  triggerElement.value = trigger ?? null
  isVisible.value = true
}

const hideMenu = () => {
  isVisible.value = false
  triggerElement.value?.focus()
  triggerElement.value = null
}

const executeHandler = (option: Option) => {
  if (handler.value) {
    handler.value(option, params.value)
  }
  hideMenu()
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!isVisible.value) return
  // クリックされた要素がメニューの外側なら閉じる
  const targetElement = event.target as HTMLElement
  if (!targetElement.closest(".option-menu") && !targetElement.closest(".option-menu-button")) {
    hideMenu()
  }
}

export function useOptionMenu() {
  return {
    isVisible,
    options,
    position,
    showMenu,
    hideMenu,
    executeHandler,
    handleDocumentClick,
  }
}
