import type { Tag } from "@/schemas/Tag"
import { ref, nextTick, type Ref } from "vue"

export function useTagOrderList(
  tags: Ref<Tag[]>,
  getHandleElementById: (tagId: string) => HTMLElement | null,
) {
  const activeTagId = ref<string | null>(null)

  const isValidIndex = (index: number) => {
    return 0 <= index && index < tags.value.length
  }

  const isActive = (tagId: string) => {
    return activeTagId.value === tagId
  }

  const activate = (tagId: string) => {
    activeTagId.value = tagId
  }

  const deactivate = () => {
    activeTagId.value = null
  }

  const moveTagItem = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    if (!isValidIndex(fromIndex) || !isValidIndex(toIndex)) return
    const updated = [...tags.value]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    tags.value = updated
  }

  const moveFocus = (toIndex: number) => {
    if (!isValidIndex(toIndex)) return
    setTimeout(() => {
      const tagId = tags.value[toIndex].id
      const handle = getHandleElementById(tagId)
      handle?.scrollIntoView({ behavior: "smooth", block: "nearest" })
      handle?.focus()
    }, 0)
  }

  const handleKeydown = async (event: KeyboardEvent, tagId: string) => {
    const index = tags.value.findIndex((t: Tag) => t.id === tagId)
    if (index === -1) return

    if (event.key === "Escape" || event.key === "Tab") {
      deactivate()
      return
    }

    if (event.key === "Enter" || event.key === " ") {
      if (isActive(tagId)) {
        deactivate()
      } else {
        activate(tagId)
      }
      event.preventDefault()
      return
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const dir = event.key === "ArrowUp" ? -1 : 1
      if (isActive(tagId)) {
        if (isValidIndex(index + dir)) {
          moveTagItem(index, index + dir)
          await nextTick()
          moveFocus(index + dir)
        }
      } else {
        if (isValidIndex(index + dir)) {
          moveFocus(index + dir)
        }
      }
      event.preventDefault()
    }
  }

  return {
    activeTagId,
    isActive,
    handleKeydown,
  }
}
