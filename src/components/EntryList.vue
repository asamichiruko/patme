<script setup>
import { onMounted, ref } from "vue"
import PromptDialog from "@/components/PromptDialog.vue"
import { useNotification } from "@/composables/useNotification.js"
import EntryListItem from "@/components/EntryListItem.vue"
import TagEditorDialog from "@/components/TagEditorDialog.vue"

const props = defineProps({
  entryModel: Object,
})

const { trigger } = useNotification()

const entries = ref([])
const selectedId = ref("")

const showPrompt = ref(false)

const showTabEditor = ref(false)
const selectedTagIds = ref([])
const allTags = ref(null)
const addRequestedTagId = ref("")

const inputComment = (achievementId) => {
  selectedId.value = achievementId
  showPrompt.value = true
}

const addStar = (content) => {
  const result = props.entryModel.addStar({ achievementId: selectedId.value, content })
  if (result) {
    trigger("コメントを記録しました！", "success")
  } else {
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  }
}

const editTags = (achievementId, tags) => {
  selectedId.value = achievementId
  selectedTagIds.value = tags.map((t) => t.id)
  showTabEditor.value = true
}

const updateTags = (tagIds) => {
  props.entryModel.setTagsForAchievement({ achievementId: selectedId.value, tagIds })
}

const addNewTag = (title) => {
  const newTag = props.entryModel.addTag({ title })

  if (newTag) {
    allTags.value = props.entryModel.getAllTags()
    addRequestedTagId.value = newTag.id
    return
  }

  const found = allTags.value.find((tag) => tag.title === title)
  if (found) {
    addRequestedTagId.value = found.id
  }
}

onMounted(() => {
  entries.value = props.entryModel.getEntries()
  allTags.value = props.entryModel.getAllTags()

  props.entryModel.subscribe(() => {
    entries.value = props.entryModel.getEntries()
    allTags.value = props.entryModel.getAllTags()
  })
})
</script>

<template>
  <p class="empty-state" v-if="!entries || entries.length === 0">
    できたことを記録してみましょう！
  </p>
  <ul class="entries" v-else>
    <li class="entry-item" v-for="entry in entries" :key="entry.achievement.id">
      <EntryListItem :entry="entry" />
      <div class="entry-actions">
        <button class="comment-button" @click="inputComment(entry.achievement.id)">
          コメントする
        </button>
        <button class="tag-edit-button" @click="editTags(entry.achievement.id, entry.tags)">
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

  <TagEditorDialog
    :show="showTabEditor"
    @update:show="showTabEditor = $event"
    :initialTagIds="selectedTagIds"
    :allTags="allTags"
    :addRequestedTagId="addRequestedTagId"
    @submit="updateTags"
    @add-tag="addNewTag"
  />
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

.tag-edit-button {
  background-color: #2ecc71;
  color: white;
  font-size: 14px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.tag-edit-button:hover {
  background-color: #27ae60;
}
.tag-edit-button:focus-visible {
  outline: 2px solid #27ae60;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
