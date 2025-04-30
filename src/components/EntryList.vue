<script setup>
import { onMounted, ref } from "vue"
import PromptDialog from "@/components/PromptDialog.vue"
import { useNotification } from "@/composables/useNotification.js"
import EntryListItem from "@/components/EntryListItem.vue"
import TaggingDialog from "@/components/TaggingDialog.vue"
import commentImg from "@/assets/comment.svg"
import tagImg from "@/assets/tag.svg"

const props = defineProps({
  entryModel: Object,
})

const { trigger } = useNotification()

const entries = ref([])
const allTags = ref(null)

const showPrompt = ref(false)
const selectedId = ref("")

const tagEditorRef = ref(null)
const showTabEditor = ref(false)
const selectedTagIds = ref([])

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

const addNewTag = async (title) => {
  const newTag = props.entryModel.addTag({ title })

  if (newTag) {
    allTags.value = props.entryModel.getAllTags()
    await tagEditorRef.value?.selectTagById(newTag.id)
    return
  }

  const found = allTags.value.find((tag) => tag.title === title)
  if (found) {
    await tagEditorRef.value?.selectTagById(found.id)
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
          <img :src="commentImg" alt="" class="comment-icon" width="20px" height="20px" />
          <span class="comment-text">コメント</span>
        </button>
        <button class="tag-edit-button" @click="editTags(entry.achievement.id, entry.tags)">
          <img :src="tagImg" alt="" class="tag-icon" width="20px" height="20px" />
          <span class="tag-text">タグ</span>
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

  <TaggingDialog
    ref="tagEditorRef"
    :show="showTabEditor"
    @update:show="showTabEditor = $event"
    :initial-tag-ids="selectedTagIds"
    :all-tags="allTags"
    @submit="updateTags"
    @add-tag="addNewTag"
  />
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 48px 0;
  color: var(--color-subtext);
}

.entries {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.entry-item {
  background-color: var(--color-card);
  border: 1px solid var(--color-card-border);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  border-radius: 4px;
}
.entry-actions {
  margin-top: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.comment-button {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
  font-size: 14px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}
.comment-button:hover {
  background-color: var(--color-primary-hover);
}
.comment-button:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
  border-radius: 4px;
}
.comment-icon {
  width: 18px;
  height: 18px;
  padding-right: 4px;
  display: inline-block;
}
.comment-text {
  display: inline-block;
}

.tag-edit-button {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
  font-size: 14px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}
.tag-edit-button:hover {
  background-color: var(--color-primary-hover);
}
.tag-edit-button:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
  border-radius: 4px;
}
.tag-icon {
  width: 18px;
  height: 18px;
  padding-right: 4px;
  display: inline-block;
}
.tag-text {
  display: inline-block;
}
</style>
