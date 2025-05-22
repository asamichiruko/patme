<script setup>
import EntryForm from "@/components/entry/EntryForm.vue"
import EntryList from "@/components/entry/EntryList.vue"
import { provide } from "vue"

const props = defineProps({
  entryModel: Object,
  tagModel: Object,
  taggingModel: Object,
})

provide("updateTaggings", (taggings) => {
  return props.taggingModel.updateTaggings(taggings)
})
</script>

<template>
  <EntryForm />
  <hr />
  <EntryList />
</template>

<style scoped>
hr {
  border: none;
  border-top: 1px solid var(--color-border);
  color: var(--color-border);
  margin: 32px 0;
}
</style>
