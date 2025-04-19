<script setup>
import { onMounted, ref } from "vue"
import PromptDialog from "@/components/PromptDialog.vue"
import { useNotification } from "@/composables/useNotification.js"
import EntryListItem from "@/components/EntryListItem.vue"
import TagSelectDialog from "./TagSelectDialog.vue"

const props = defineProps({
  entryModel: Object,
})

const { trigger } = useNotification()
const entries = ref([])
const showPrompt = ref(false)
const showTabSelect = ref(false)
const selectedId = ref("")

const inputComment = (e) => {
  selectedId.value = e.target.getAttribute("achievement-id")
  showPrompt.value = true
}

const editTabs = (e) => {
  selectedId.value = e.target.getAttribute("achievement-id")
  showTabSelect.value = true
}

const addStar = (content) => {
  const result = props.entryModel.addStar({ achievementId: selectedId.value, content })
  if (result) {
    trigger("コメントを記録しました！", "success")
  } else {
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  }
}

onMounted(() => {
  entries.value = props.entryModel.getEntries()

  props.entryModel.subscribe(() => {
    entries.value = props.entryModel.getEntries()
  })
})
</script>

<template>
  <p class="empty-state" v-if="!entries || entries.length === 0">
    できたことを記録してみましょう！
  </p>
  <ul class="entries" v-else>
    <li class="entry-item" v-for="entry in entries" :key="entry.achievement.id">
      <EntryListItem :achievement="entry.achievement" :stars="entry.stars" />
      <div class="entry-actions">
        <button class="comment-button" :achievement-id="entry.achievement.id" @click="inputComment">
          コメントする
        </button>
        <button class="tag-button" :achievement-id="entry.achievement.id" @click="editTabs">
          タグを編集
        </button>
      </div>
    </li>
  </ul>

  <PromptDialog
    :show="showPrompt"
    @update:show="showPrompt = $event"
    :message="'振り返り'"
    :submittext="'記録する'"
    :canceltext="'キャンセル'"
    :placeholder="'どんな点がよかったですか？'"
    @submit="addStar"
  />

  <TagSelectDialog :show="showTabSelect" @update:show="showTabSelect = $event" />
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #7f8c8d;
}

.entries {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.entry-item {
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
  padding: 15px;
  border-radius: 4px;
}
.entry-actions {
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

.tag-button {
  background-color: #2ecc71;
  color: white;
  font-size: 14px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.tag-button:hover {
  background-color: #27ae60;
}
.tag-button:focus-visible {
  outline: 2px solid #27ae60;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
