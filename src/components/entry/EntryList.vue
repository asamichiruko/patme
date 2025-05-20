<script setup>
import { onMounted, ref } from "vue"
import { useNotification } from "@/composables/useNotification.js"
import { subscribe } from "@/utils/storageNotifier.js"
import EntryListItem from "@/components/entry/EntryListItem.vue"
import { useTagStore } from "@/composables/useTagStore.js"

const props = defineProps({
  entryModel: Object,
  tagModel: Object,
  taggingModel: Object,
})

const { trigger } = useNotification()
const tagStore = useTagStore(props.tagModel)
const entries = ref([])

const addComment = (star) => {
  const result = props.entryModel.addStar(star)

  if (result) {
    trigger("コメントを記録しました！", "success")
  } else {
    trigger("記録に失敗しました。時間をおいて再度お試しください", "error")
  }
}

const updateTaggings = (taggings) => {
  props.taggingModel.updateTaggings(taggings)
}

onMounted(() => {
  const reload = () => {
    entries.value = props.entryModel.getEntriesWithTags({
      sortFn: (a, b) => new Date(b.date) - new Date(a.date),
    })
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
      <EntryListItem
        :entry="entry"
        @commented="addComment"
        @tagged="updateTaggings"
        :tag-store="tagStore"
      />
    </li>
  </ul>
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
