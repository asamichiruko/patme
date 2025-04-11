<script setup>
import { onMounted, ref } from "vue"
import StarDialog from "@/components/StarDialog.vue"

const props = defineProps({
  recordModel: Object,
})

const records = ref([])
const showDialog = ref(false)
const selectedId = ref(null)

const openStarDialog = (id) => {
  selectedId.value = id
  showDialog.value = true
}

const handleSubmit = ({ achievementId, content }) => {
  props.recordModel.addStar({ achievementId, content })
  showDialog.value = false
}

const handleCancel = () => {
  showDialog.value = false
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
    <li class="achievement-item" v-for="record in records" :key="record.achievement.id">
      <div class="achievement-content">{{ record.achievement.content }}</div>
      <div class="achievement-date">記録日時: {{ record.achievement.date.toLocaleString() }}</div>
      <div class="achievement-actions">
        <button
          class="star-button"
          :achievement-id="record.achievement.id"
          @click="openStarDialog(record.achievement.id)"
        >
          ほめる
        </button>
      </div>
      <template v-if="record.stars.length !== 0">
        <div class="achievement-star">★ {{ record.stars.length }}</div>
        <ul class="star-history" v-for="star in record.stars" :key="star.id">
          <li>{{ star.date.toLocaleString() }}: {{ star.content || "理由を問わず" }}</li>
        </ul>
      </template>
    </li>
  </ul>

  <StarDialog
    :show="showDialog"
    :achievementId="selectedId"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
.achievement-item {
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 4px;
}
.achievement-content {
  margin-bottom: 10px;
  font-size: 18px;
}
.achievement-date {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 10px;
}
.achievement-star {
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 10px;
}
.star-button {
  background-color: #2ecc71;
  color: white;
  font-size: 14px;
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.star-button:hover {
  background-color: #27ae60;
}
.star-history {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #7f8c8d;
}
.achievement-actions {
  display: flex;
}
</style>
