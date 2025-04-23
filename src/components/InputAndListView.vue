<script setup>
import InputForm from "@/components/InputForm.vue"
import EntryList from "@/components/EntryList.vue"

const props = defineProps({
  entryModel: Object,
})
</script>

<template>
  <InputForm :entryModel="props.entryModel" />
  <hr />
  <EntryList :entryModel="props.entryModel" />
</template>

<style scoped>
hr {
  border: none;
  border-top: 1px solid var(--color-border);
  color: var(--color-border);
  margin: 32px 0;
}
</style>
