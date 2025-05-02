<script setup>
import { useNotification } from "@/composables/useNotification.js"

const props = defineProps({
  entryModel: Object,
})

const { trigger } = useNotification()

const exportEntries = () => {
  const json = props.entryModel.exportAsJson()
  const blob = new Blob([JSON.stringify(json)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const dateString = new Date().toLocaleDateString("sv-SE")
  const a = document.createElement("a")
  a.href = url
  a.download = `entries-${dateString}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  trigger("データをエクスポートしました", "success")
}
</script>

<template>
  <form @submit.prevent="exportEntries">
    <button type="submit" class="primary-button">記録をエクスポートする</button>
  </form>
</template>
