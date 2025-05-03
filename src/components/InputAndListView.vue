<script setup>
import InputForm from "@/components/InputForm.vue"
import EntryList from "@/components/EntryList.vue"

const props = defineProps({
  entryModel: Object,
  tagModel: Object,
})
</script>

<template>
  <InputForm :entry-model="props.entryModel" />
  <hr />
  <EntryList :entry-model="props.entryModel" :tag-model="props.tagModel" />
</template>

<style scoped>
hr {
  border: none;
  border-top: 1px solid var(--color-border);
  color: var(--color-border);
  margin: 32px 0;
}
</style>
