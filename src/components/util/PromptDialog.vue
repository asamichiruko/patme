<script setup>
import { ref, watch } from "vue"
import { usePromptDialog } from "@/composables/usePromptDialog.js"

const emit = defineEmits(["submit", "cancel"])

const { isOpen, params, closePrompt } = usePromptDialog()

const dialogRef = ref(null)
const inputValue = ref("")

watch(isOpen, (val) => {
  if (val) {
    inputValue.value = params.defaultValue
    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
  }
})

const submit = () => {
  emit("submit", inputValue.value)
  closePrompt(inputValue.value)
}

const cancel = () => {
  emit("cancel")
  closePrompt(null)
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef" @cancel="cancel">
      <form @submit.prevent="submit">
        <label>
          <span class="message">振り返り</span>
          <textarea
            v-model="inputValue"
            @keydown.ctrl.enter="submit"
            placeholder="どんな点がよかったですか？"
            class="text"
            required
          ></textarea>
        </label>
        <div class="actions">
          <button class="cancel-button" type="button" @click="cancel">キャンセル</button>
          <button class="primary-button" type="submit">記録する</button>
        </div>
      </form>
    </dialog>
  </Teleport>
</template>

<style scoped>
dialog {
  border: none;
  border-radius: 8px;
  padding: 16px;
  max-width: 400px;
  width: 80%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}
.text {
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 16px;
  display: block;
  width: -webkit-fill-available;
  width: -moz-available;
  width: stretch;
  height: 60px;
  line-height: 1.6;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}
</style>
