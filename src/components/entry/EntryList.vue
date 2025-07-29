<script setup>
import EntryListFilterSelector from "@/components/entry/EntryListFilterSelector.vue"
import EntryListItem from "@/components/entry/EntryListItem.vue"
import { useEntryStore } from "@/stores/useEntryStore"
import { subscribe } from "@/utils/storageNotifier.js"
import { onMounted, ref, watch } from "vue"

const entryStore = useEntryStore()
const entries = ref([])
const viewEntryType = ref("all")

const reload = () => {
  entries.value = entryStore
    .getEntriesWithTags()
    .filter((a) => {
      switch (viewEntryType.value) {
        case "all":
          return true
        case "reviewed":
          return a.entryType === "achievement" || a.entryType === "accepted"
        default:
          return a.entryType === viewEntryType.value
      }
    })
    .toSorted((a, b) => new Date(b.date) - new Date(a.date))
}

onMounted(() => {
  subscribe(reload)
  reload()
})

watch(viewEntryType, () => {
  reload()
})
</script>

<template>
  <EntryListFilterSelector v-model="viewEntryType" />
  <p class="empty-state" v-if="!entries || entries.length === 0">
    できたことを記録してみましょう！
  </p>
  <div v-else>
    <ul class="entries">
      <li v-for="entry in entries" :key="entry.id">
        <EntryListItem :entry="entry" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 48px 0;
  color: var(--color-subtext);
}
.entries {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
</style>
