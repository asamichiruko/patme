<script setup>
import InputForm from "@/components/InputForm.vue"
import RecordList from "@/components/RecordList.vue"

const props = defineProps({
  recordModel: Object,
})
</script>

<template>
  <InputForm :recordModel="props.recordModel" />
  <hr />
  <RecordList :recordModel="props.recordModel" />
</template>

<style scoped>
hr {
  border: none;
  border-top: 2px solid #ddd;
  color: #ddd;
  margin: 30px 0;
}
</style>
