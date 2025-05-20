<script setup>
const props = defineProps({
  tags: Array,
})
</script>

<template>
  <ul class="tags">
    <li class="tag selected" v-for="tag in props.tags" :key="tag.id">{{ tag.title }}</li>
  </ul>
</template>

<style scoped>
.tags {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}
</style>
