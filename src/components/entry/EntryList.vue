<script setup>
import { onMounted, ref } from "vue"
import { subscribe } from "@/utils/storageNotifier.js"
import { useEntryStore } from "@/stores/useEntryStore"
import EntryListItem from "@/components/entry/EntryListItem.vue"

const entryStore = useEntryStore()
const entries = ref([])

onMounted(() => {
  const reload = () => {
    entries.value = entryStore.getEntriesWithTags({
      sortFn: (a, b) => new Date(b.date) - new Date(a.date),
    })
  }

  subscribe(reload)
  reload()
})
</script>

<template>
  <p class="empty-state" v-if="!entries || entries.length === 0">
    できたことを記録してみましょう！
  </p>
  <ul class="entries" v-else>
    <li class="entry-item" v-for="entry in entries" :key="entry.id">
      <EntryListItem :entry="entry" />
    </li>
  </ul>
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
.entry-item {
  background-color: var(--color-card);
  border: 1px solid var(--color-card-border);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  border-radius: 4px;
}
</style>
