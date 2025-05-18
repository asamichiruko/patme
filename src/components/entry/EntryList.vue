<script setup>
import { onMounted, ref } from "vue"
import { useNotification } from "@/composables/useNotification.js"
import { subscribe } from "@/utils/storageNotifier.js"
import EntryListItem from "@/components/entry/EntryListItem.vue"
import EntryDialogs from "@/components/entry/EntryDialogs.vue"
import { useDialogStore } from "@/composables/useDialogStore.js"

const props = defineProps({
  entryModel: Object,
  tagModel: Object,
  taggingModel: Object,
})

const { trigger } = useNotification()
const { open } = useDialogStore()

const entries = ref([])
const allTags = ref(null)
const showingDialog = ref("")
const selectedEntry = ref(null)
const entryDialogsRef = ref(null)

const inputComment = async (entry) => {
  const content = await open("prompt", {
    message: "振り返り",
    placeholder: "どんな点がよかったですか？",
    submittext: "記録する",
    canceltext: "キャンセル",
  })

  if (!content) {
    return
  }

  const result = props.entryModel.addStar({
    achievementId: entry.id,
    content,
    date: new Date(),
  })

  if (result) {
    trigger("コメントを記録しました！", "success")
  } else {
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  }
}

const editTags = (entry) => {
  selectedEntry.value = entry
  showingDialog.value = "tagging"
}

const closeDialog = () => {
  selectedEntry.value = null
  showingDialog.value = ""
}

const updateTaggings = (tagIds) => {
  props.taggingModel.updateTaggings({ achievementId: selectedEntry.value.id, tagIds })

  closeDialog()
}

const addTag = async (title) => {
  const newTag = props.tagModel.addTag({ title })

  if (newTag) {
    allTags.value = props.tagModel.getTagsOrdered()
    await entryDialogsRef.value?.selectTagById(newTag.id)
    return
  }

  const found = allTags.value.find((tag) => tag.title === title)
  if (found) {
    await entryDialogsRef.value?.selectTagById(found.id)
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

  <EntryDialogs
    ref="entryDialogsRef"
    :showingDialog="showingDialog"
    :entry="selectedEntry"
    :all-tags="allTags"
    @add-tag="addTag"
    @update-taggings="updateTaggings"
    @close="closeDialog"
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
