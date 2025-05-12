<script setup>
import { onMounted, ref } from "vue"
import PromptDialog from "@/components/PromptDialog.vue"
import { useNotification } from "@/composables/useNotification.js"
import { subscribe } from "@/utils/storageNotifier.js"
import EntryListItem from "@/components/EntryListItem.vue"
import TaggingDialog from "@/components/TaggingDialog.vue"

const props = defineProps({
  entryModel: Object,
  tagModel: Object,
  taggingModel: Object,
})

const { trigger } = useNotification()

const entries = ref([])
const allTags = ref(null)

const showPrompt = ref(false)
const selectedId = ref("")

const tagEditorRef = ref(null)
const showTagEditor = ref(false)
const selectedTagIds = ref([])

const inputComment = (achievementId) => {
  selectedId.value = achievementId
  showPrompt.value = true
}

const addStar = (content) => {
  const result = props.entryModel.addStar({
    achievementId: selectedId.value,
    content,
    date: new Date(),
  })
  if (result) {
    trigger("コメントを記録しました！", "success")
  } else {
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  }
}

const editTags = (achievementId, tags) => {
  selectedId.value = achievementId
  selectedTagIds.value = tags.map((t) => t.id)
  showTagEditor.value = true
}

const updateTags = (tagIds) => {
  props.taggingModel.updateTaggings({ achievementId: selectedId.value, tagIds: tagIds })
}

const addNewTag = async (title) => {
  const newTag = props.tagModel.addTag({ title })

  if (newTag) {
    allTags.value = props.tagModel.getTagsOrdered()
    await tagEditorRef.value?.selectTagById(newTag.id)
    return
  }

  const found = allTags.value.find((tag) => tag.title === title)
  if (found) {
    await tagEditorRef.value?.selectTagById(found.id)
  }
}

onMounted(() => {
  const reload = () => {
    entries.value = props.entryModel.getEntriesWithTags({
      sortFn: (a, b) => new Date(b.date) - new Date(a.date),
    })
    allTags.value = props.tagModel.getTagsOrdered()
  }

  subscribe(reload)
  reload()
})
</script>

<template>
  <p class="empty-state" v-if="!entries || entries.length === 0">
    できたことを記録してみましょう！
  </p>
  <ul class="entries" v-else>
    <li class="entry-item" v-for="entry in entries" :key="entry.id">
      <EntryListItem :entry="entry" @comment="inputComment" @tagging="editTags" />
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
    :show="showTagEditor"
    @update:show="showTagEditor = $event"
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
</style>
