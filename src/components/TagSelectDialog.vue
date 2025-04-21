<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  show: Boolean,
  initialTagIds: Array,
  allTags: Array,
})
const emit = defineEmits(["update:show", "submit", "cancel"])

const dialogRef = ref(null)
const selectedTagIds = ref([])

watch(
  () => props.show,
  (val) => {
    if (val) {
      selectedTagIds.value = Array.from(props.initialTagIds)
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
    }
  },
)

const submit = () => {
  emit("submit", Array.from(selectedTagIds.value))
  emit("update:show", false)
}

const cancel = () => {
  emit("cancel")
  emit("update:show", false)
}

const toggleSelectedState = (id) => {
  const idx = selectedTagIds.value.indexOf(id)
  if (idx === -1) {
    selectedTagIds.value.push(id)
  } else {
    selectedTagIds.value.splice(idx, 1)
  }
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef" @cancel="cancel">
      <template v-if="show">
        <p class="message">割り当てるタグを選んでください</p>
        <form @submit.prevent="submit">
          <ul class="tag-list">
            <li v-for="tag in props.allTags" :key="tag.id">
              <button
                :class="['tag', { selected: selectedTagIds.includes(tag.id) }]"
                type="button"
                @click="toggleSelectedState(tag.id)"
                :tag-id="tag.id"
              >
                {{ tag.title }}
              </button>
            </li>
          </ul>
          <div class="actions">
            <button class="primary-button" type="submit">決定</button>
            <button class="primary-button" type="button" @click="cancel">キャンセル</button>
          </div>
        </form>
      </template>
    </dialog>
  </Teleport>
</template>

<style scoped>
dialog {
  border: none;
  border-radius: 8px;
  padding: 1em;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tag-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.tag-option {
  display: inline-block;
  text-align: text-bottom;
}
.tag {
  display: inline-block;
  color: #53656d;
  background-color: #fff;
  border: 1px dashed #76878d;
  padding: 0 12px;
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
}
.tag.selected {
  display: inline-block;
  color: #53656d;
  background-color: #e0e4e6;
  border: 1px solid #76878d;
  padding: 0 12px;
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
}

.actions {
  display: flex;
  gap: 1em;
  margin-top: 2em;
}
</style>
