<script setup>
import EntryListItem from "@/components/entry/EntryListItem.vue"
import { useEntryStore } from "@/stores/useEntryStore"
import { subscribe } from "@/utils/storageNotifier.js"
import { onMounted, ref } from "vue"

const entryStore = useEntryStore()
const entries = ref([])
const viewMode = ref("accepted")

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
  <div v-else>
    <div class="view-mode">
      <label>
        <span class="mode-select-label">表示する記録</span>
        <select v-model="viewMode">
          <option value="accepted" selected>ふりかえり済み</option>
          <option value="all">すべて</option>
        </select>
      </label>
    </div>
    <ul class="entries">
      <li class="entry-item" v-for="entry in entries" :key="entry.id">
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
.entry-item {
  background-color: var(--color-card);
  border: 1px solid var(--color-card-border);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  border-radius: 4px;
}
</style>
