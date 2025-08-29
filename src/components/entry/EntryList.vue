<script setup lang="ts">
import EntryListFilterSelector from "@/components/entry/EntryListFilterSelector.vue"
import EntryListItem from "@/components/entry/EntryListItem.vue"
import type { EntryType } from "@/schemas/EntryType"
import type { EntryWithRelations } from "@/schemas/EntryWithRelations"
import { useEntryStore } from "@/stores/useEntryStore"
import { subscribe } from "@/utils/storageNotifier"
import { computed, onMounted, ref } from "vue"

const entryStore = useEntryStore()

const entries = computed<EntryWithRelations[]>(() =>
  entryStore.entriesWithRelations
    .filter((a) => {
      switch (viewEntryType.value) {
        case "all":
          return true
        case "reviewed":
          return a.isReviewed
        default:
          return a.entryType === viewEntryType.value
      }
    })
    .toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
)
const viewEntryType = ref<EntryType | "all" | "reviewed">("all")

const reload = async () => {
  await entryStore.fetchEntriesWithRelations()
}

onMounted(async () => {
  subscribe(reload)
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
