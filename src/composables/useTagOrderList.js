import { ref, nextTick } from "vue"

export function useTagOrderList(tags, getHandleElementById) {
  const activeTagId = ref(null)

  const isValidIndex = (index) => {
    return 0 <= index && index < tags.value.length
  }

  const isActive = (tagId) => {
    return activeTagId.value === tagId
  }

  const activate = (tagId) => {
    activeTagId.value = tagId
  }

  const deactivate = () => {
    activeTagId.value = null
  }

  const moveTagItem = (fromIndex, toIndex) => {
    if (!isValidIndex(fromIndex) || !isValidIndex(toIndex)) return
    const updated = [...tags.value]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    tags.value = updated
  }

  const moveFocus = (toIndex) => {
    if (!isValidIndex(toIndex)) return
    const tagId = tags.value[toIndex].id
    const handle = getHandleElementById(tagId)
    handle?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    handle?.focus()
  }

  const handleKeydown = (event, tagId) => {
    const index = tags.value.findIndex((t) => t.id === tagId)
    if (index === -1) return

    if (event.key === "Escape" || event.key === "Tab") {
      deactivate()
      return
    }

    if (event.key === "Enter" || event.key === " ") {
      isActive(tagId) ? deactivate() : activate(tagId)
      event.preventDefault()
      return
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const dir = event.key === "ArrowUp" ? -1 : 1
      if (isActive(tagId)) {
        if (isValidIndex(index + dir)) {
          moveTagItem(index, index + dir)
          nextTick(() => moveFocus(index + dir))
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
