<script setup>
import EntryListItem from "@/components/entry/EntryListItem.vue"
import { useEntryStore } from "@/stores/useEntryStore"
import { subscribe } from "@/utils/storageNotifier.js"
import { onMounted, ref, watch } from "vue"

const entryStore = useEntryStore()
const entries = ref([])
const viewMode = ref("all")

const reload = () => {
  entries.value = entryStore.getEntriesWithTags({
    sortFn: (a, b) => new Date(b.date) - new Date(a.date),
  })
}

onMounted(() => {
  subscribe(reload)
  reload()
})

watch(
  () => viewMode,
  (val) => {
    console.log(val)
  },
)

const options = [
  { value: "all", label: "すべて" },
  { value: "reviewed", label: "ふりかえり済み" },
  { value: "achievement", label: "よかったこと" },
  { value: "incomplete", label: "ふりかえりたいこと" },
  { value: "accepted", label: "受け入れたこと" },
]
</script>

<template>
  <p class="empty-state" v-if="!entries || entries.length === 0">
    できたことを記録してみましょう！
  </p>
  <div v-else>
    <div class="view-mode-selector">
      <div class="visually-hidden">表示する記録</div>
      <label
        v-for="option in options"
        :key="option.value"
        :class="['view-mode-option', { selected: viewMode === option.value }]"
      >
        <input
          type="radio"
          name="viewMode"
          :value="option.value"
          v-model="viewMode"
          class="visually-hidden"
        />
        <div class="view-mode-label">{{ option.label }}</div>
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

.view-mode-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.view-mode-option {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: #f8f8f8;
  color: #444;
}
.view-mode-option.selected {
  border-color: hsl(123, 40%, 50%);
  background-color: hsl(123, 40%, 94%);
  color: hsl(123, 40%, 34%);
  font-weight: 600;
}
.view-mode-option:focus-within {
  box-shadow: 0 0 0 3px hsla(123, 40%, 50%, 0.4);
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
