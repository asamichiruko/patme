<script setup lang="ts">
import EntryListItem from "@/components/entry/EntryListItem.vue"
import type { EntryWithRelations } from "@/schemas/EntryWithRelations"

const props = defineProps<{
  entries: EntryWithRelations[]
}>()
</script>

<template>
  <p class="empty-state" v-if="props.entries.length === 0">記録がありません</p>
  <div v-else>
    <ul class="entries">
      <li v-for="entry in props.entries" :key="entry.id">
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
