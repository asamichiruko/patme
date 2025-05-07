<script setup>
import { useNotification } from "@/composables/useNotification.js"

const props = defineProps({
  exportModel: Object,
})

const { trigger } = useNotification()

const filenameFromDate = () => {
  const dateString = new Date().toLocaleDateString("sv-SE")
  return `entries-${dateString}.json`
}

const exportData = () => {
  const file = props.exportModel.exportToFile()
  console.log(file)
  const url = URL.createObjectURL(file)
  const a = document.createElement("a")
  a.href = url
  a.download = filenameFromDate()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  trigger("データをエクスポートしました", "success")
}
</script>

<template>
  <form @submit.prevent="exportData">
    <button type="submit" class="primary-button">記録をエクスポートする</button>
  </form>
</template>
