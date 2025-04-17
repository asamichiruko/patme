<script setup>
import { onMounted, ref } from "vue"
import PromptDialog from "@/components/PromptDialog.vue"
import RecordListItem from "@/components/RecordListItem.vue"

const props = defineProps({
  recordModel: Object,
})

const records = ref([])
const showPrompt = ref(false)
const requestingDialog = ref(null)

const openDialog = (e) => {
  requestingDialog.value = e.target
  showPrompt.value = true
}

const handleSubmit = (content) => {
  const achievementId = requestingDialog.value?.getAttribute("achievement-id")
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
  <ul class="records" v-else>
    <li class="record-item" v-for="record in records" :key="record.achievement.id">
      <RecordListItem :achievement="record.achievement" :stars="record.stars" />
      <div class="record-actions">
        <button class="comment-button" :achievement-id="record.achievement.id" @click="openDialog">
          コメント
        </button>
      </div>
    </li>
  </ul>

  <PromptDialog
    :show="showPrompt"
    @update:show="showPrompt = $event"
    :message="'コメント'"
    :submittext="'記録する'"
    :canceltext="'キャンセル'"
    :placeholder="'どんな点がよかったですか？'"
    @submit="handleSubmit"
  />
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #7f8c8d;
}
.records {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.record-item {
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
  padding: 15px;
  border-radius: 4px;
}
.record-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}
.comment-button {
  background-color: #2ecc71;
  color: white;
  font-size: 14px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.comment-button:hover {
  background-color: #27ae60;
}
.comment-button:focus-visible {
  outline: 2px solid #27ae60;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
