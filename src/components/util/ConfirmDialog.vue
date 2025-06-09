<script setup>
import { ref, watch } from "vue"
import { useConfirmDialog } from "@/composables/useConfirmDialog.js"

const emit = defineEmits(["submit", "cancel"])

const { isOpen, params, closeConfirm } = useConfirmDialog()

const dialogRef = ref(null)

watch(isOpen, (val) => {
  if (val) {
    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
  }
})

const submit = () => {
  emit("submit", true)
  closeConfirm(true)
}

const cancel = () => {
  emit("cancel")
  closeConfirm(false)
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef" @cancel="cancel">
      <form @submit.prevent="submit">
        <h2 class="title">{{ params.title }}</h2>
        <div class="message">{{ params.message }}</div>
        <div class="actions">
          <button class="cancel-button" type="button" @click="cancel">キャンセル</button>
          <button class="warning-button" type="submit">削除する</button>
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

.title {
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--color-text);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}
</style>
