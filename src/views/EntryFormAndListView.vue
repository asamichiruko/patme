<script setup lang="ts">
import EntryForm from "@/components/entry/EntryForm.vue"
import EntryList from "@/components/entry/EntryList.vue"
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
