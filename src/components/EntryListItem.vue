<script setup>
import starImg from "@/assets/star.svg"
import blankStarImg from "@/assets/blank-star.svg"

const props = defineProps({
  entry: Object,
})
</script>

<template>
  <div class="entry-container">
    <div class="achievement-header">
      <div class="star-count">
        <template v-if="props.entry.stars.length === 0">
          <img :src="blankStarImg" alt="blank-star" class="star-icon" />
        </template>
        <template v-else>
          <img :src="starImg" alt="star" class="star-icon" />
          <span class="star-count-text">{{ props.entry.stars.length }}</span>
        </template>
      </div>
      <div class="achievement-date">{{ props.entry.achievement.date.toLocaleString() }}</div>
    </div>
    <div class="achievement-content">
      {{ props.entry.achievement.content }}
    </div>
    <ul class="tags">
      <li class="tag selected" v-for="tag in props.entry.tags" :key="tag.id">{{ tag.title }}</li>
    </ul>
    <template v-if="props.entry.stars.length !== 0">
      <ul class="stars" v-for="star in props.entry.stars" :key="star.id">
        <li class="star-comment" v-if="star.content">
          <span class="star-content">{{ star.content }}</span>
          <span class="star-date">{{ star.date.toLocaleString() }}</span>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.achievement-header {
  display: flex;
}
.achievement-date {
  color: #7f8c8d;
  font-size: 0.9em;
  margin-left: auto;
}
.star-count {
  font-family: "Franklin Gothic", "Arial Bold", Arial, sans-serif;
  color: #2ecc71;
  font-size: 1.2em;
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
  gap: 0.2em;
}
.star-icon {
  width: 1.1em;
  height: 1.1em;
  padding-bottom: 0.2em;
  display: inline-block;
}
.star-count-text {
  font-weight: bold;
  display: inline-block;
}

.achievement-content {
  font-size: 1.1em;
  white-space: pre-wrap;
  margin: 20px 0;
  padding: 0 20px;
}

.tags {
  list-style-type: none;
  padding: 0;
  font-size: 14px;
  color: #333;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
.tag {
  display: inline-block;
}

.stars {
  list-style-type: none;
  padding: 0;
  font-size: 14px;
  color: #333;
}
.star-comment {
  margin: 5px 0;
}
.star-content {
  white-space: pre-wrap;
}
.star-date {
  color: #7f8c8d;
  margin-left: 10px;
  font-size: 14px;
}
</style>
