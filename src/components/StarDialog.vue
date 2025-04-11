<template>
  <dialog ref="dialogEl" @close="onClose">
    <form @submit.prevent="submit">
      <label for="text">コメント</label>
      <textarea
        class="text"
        name="text"
        @keydown.ctrl.enter="submit"
        ref="textareaRef"
        v-model="text"
        placeholder="どのような点がよかったですか？"
        required
      ></textarea>
      <div class="actions">
        <button class="primary-button" type="submit">記録する</button>
        <button class="primary-button" type="button" @click="cancel">キャンセル</button>
      </div>
    </form>
  </dialog>
</template>

<script setup>
import { nextTick, ref, watch } from "vue"

const props = defineProps({
  show: Boolean,
  achievementId: String,
})
const emit = defineEmits(["submit", "cancel"])

const dialogEl = ref(null)
const text = ref("")
const textareaRef = ref("")

watch(
  () => props.show,
  (value) => {
    if (value) {
      text.value = ""
      nextTick(() => textareaRef.value.focus())
      dialogEl.value?.showModal()
    } else {
      dialogEl.value?.close()
    }
  },
)

const submit = () => {
  emit("submit", {
    achievementId: props.achievementId,
    content: text.value,
  })
}

const cancel = () => {
  emit("cancel")
}

const onClose = () => {
  emit("cancel")
}
</script>

<style scoped>
dialog {
  border: none;
  border-radius: 8px;
  padding: 1em;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.text {
  padding: 0.5em;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  display: block;
  width: -webkit-fill-available;
  width: -moz-available;
  width: stretch;
}

.actions {
  display: flex;
  gap: 1em;
  margin-top: 2em;
}
</style>
