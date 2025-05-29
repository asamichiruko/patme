<script setup>
import { computed, ref, watch } from "vue"
import { useDialogStore } from "@/composables/useDialogStore.js"

const emit = defineEmits(["submit", "cancel"])

const { activeDialog, dialogParams, close } = useDialogStore()

const dialogRef = ref(null)
const text = ref("")

const message = computed(() => dialogParams.value?.message ?? "")
const submittext = computed(() => dialogParams.value?.submittext ?? "OK")
const canceltext = computed(() => dialogParams.value?.canceltext ?? "Cancel")
const placeholder = computed(() => dialogParams.value?.placeholder ?? "")

watch(activeDialog, (val) => {
  if (val === "prompt") {
    text.value = ""
    dialogRef.value?.showModal()
  } else if (val !== "prompt") {
    dialogRef.value?.close()
  }
})

const submit = () => {
  emit("submit", text.value)
  close(text.value)
}

const cancel = () => {
  emit("cancel")
  close(null)
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef" @cancel="cancel">
      <form @submit.prevent="submit">
        <label>
          <span class="message">{{ message }}</span>
          <textarea
            v-model="text"
            @keydown.ctrl.enter="submit"
            :placeholder="placeholder"
            class="text"
            required
          ></textarea>
        </label>
        <div class="actions">
          <button class="cancel-button" type="button" @click="cancel">{{ canceltext }}</button>
          <button class="primary-button" type="submit">{{ submittext }}</button>
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
