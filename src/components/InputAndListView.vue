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
  border-top: 2px solid #ddd;
  color: #ddd;
  margin: 30px 0;
}
</style>
