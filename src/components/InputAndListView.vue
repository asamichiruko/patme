<script setup>
import InputForm from "@/components/InputForm.vue"
import EntryList from "@/components/EntryList.vue"

const props = defineProps({
  entryModel: Object,
  tagModel: Object,
  taggingModel: Object,
})
</script>

<template>
  <InputForm :entry-model="props.entryModel" />
  <hr />
  <EntryList
    :entry-model="props.entryModel"
    :tag-model="props.tagModel"
    :tagging-model="props.taggingModel"
  />
</template>

<style scoped>
hr {
  border: none;
  border-top: 1px solid var(--color-border);
  color: var(--color-border);
  margin: 32px 0;
}
</style>
