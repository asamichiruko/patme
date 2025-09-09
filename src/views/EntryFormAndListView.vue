<script setup lang="ts">
import EntryForm from "@/components/entry/EntryForm.vue"
import EntryList from "@/components/entry/EntryList.vue"
import EntryListFilterSelector from "@/components/entry/EntryListFilterSelector.vue"
import type { EntryType } from "@/schemas/EntryType"
import type { EntryWithRelations } from "@/schemas/EntryWithRelations"
import { useEntryStore } from "@/stores/useEntryStore"
import { computed, ref } from "vue"

const entryStore = useEntryStore()

const entries = computed<EntryWithRelations[]>(() =>
  entryStore.entriesWithRelations
    .filter((a) => {
      switch (viewEntryType.value) {
        case "all":
          return true
        case "reviewed":
          return a.reviewedCount > 0
        default:
          return a.entryType === viewEntryType.value
      }
    })
    .toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
)
const viewEntryType = ref<EntryType | "all" | "reviewed">("all")
</script>

<template>
  <EntryForm />
  <hr />
  <EntryListFilterSelector v-model="viewEntryType" />
  <EntryList :entries="entries" />
</template>

<style scoped>
hr {
  border: none;
  border-top: 1px solid var(--color-border);
  color: var(--color-border);
  margin: 32px 0;
}
</style>
