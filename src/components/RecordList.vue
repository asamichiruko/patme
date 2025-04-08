<script setup>
import { onMounted, ref } from "vue"

const props = defineProps({
  recordModel: Object,
})

const records = ref([])

const addStar = (e) => {
  const content = prompt("コメント（任意）")
  if (content == null) {
    return
  }

  const achievementId = e.target.getAttribute("achievement-id")
  props.recordModel.addStar({ achievementId, content })
}

onMounted(() => {
  records.value = props.recordModel.getRecords()

  props.recordModel.subscribe(() => {
    records.value = props.recordModel.getRecords()
  })
})
</script>

<template>
  <p class="empty-state" v-if="!records || records.length === 0">
    できたことを記録してみましょう！
  </p>
  <ul v-else>
    <li class="achievement-item" v-for="r in records" :key="r.achievement.id">
      <div class="achievement-content">{{ r.achievement.content }}</div>
      <div class="achievement-date">記録日時: {{ r.achievement.date.toLocaleString() }}</div>
      <div class="achievement-actions">
        <button class="star-button" :achievement-id="r.achievement.id" @click="addStar">
          ほめる
        </button>
      </div>
      <template v-if="r.stars.length !== 0">
        <div class="achievement-star">★ {{ r.stars.length }}</div>
        <ul class="star-history" v-for="s in r.stars" :key="s.id">
          <li>{{ s.date.toLocaleString() }}: {{ s.content || "理由を問わず" }}</li>
        </ul>
      </template>
    </li>
  </ul>
</template>

<style scoped></style>
